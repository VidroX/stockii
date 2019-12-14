from datetime import datetime, timedelta
from background_task import background
from products.models import Product
from shipments.models import Provider, Shipment
from triggers.models import Trigger
from warehouses.models import Warehouse


def get_estimated_time(provider):
    today = datetime.now()

    if provider is None:
        return today + timedelta(days=2)

    working_to_time = datetime.now().replace(
        hour=provider.working_to.hour,
        minute=provider.working_to.minute,
        second=provider.working_to.second
    )
    is_weekend = working_to_time.weekday() == 6 or working_to_time.weekday() == 7
    is_saturday = working_to_time.weekday() == 6

    additional_days = 0
    estimated = today
    if today > working_to_time:
        additional_days = 1

    if provider.weekends:
        estimated += timedelta(days=(provider.average_delivery_time + additional_days))
    else:
        if is_weekend:
            if today > working_to_time:
                if is_saturday:
                    additional_days += 1
            else:
                additional_days += is_saturday if 2 else 1

        approximate_date = today + timedelta(days=(provider.average_delivery_time + additional_days))
        if approximate_date.weekday() == 6:
            approximate_date += timedelta(days=2)
        elif approximate_date.weekday() == 7:
            approximate_date += timedelta(days=1)

        estimated = approximate_date

    return estimated


@background(schedule=60)
def restock_product(trigger_id, product_id, quantity):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        product = None
    try:
        fastest_provider = Provider.objects.order_by(
            'average_delivery_time',
            '-weekends'
        ).first()
    except Provider.DoesNotExist:
        fastest_provider = None
    try:
        trigger = Trigger.objects.get(id=trigger_id)
    except Trigger.DoesNotExist:
        trigger = None

    if product is not None and trigger is not None and\
            fastest_provider is not None and quantity is not None and int(quantity) > 0:
        estimated = get_estimated_time(fastest_provider)

        Shipment.objects.create(
            product=product,
            provider=fastest_provider,
            quantity=int(quantity),
            approximate_delivery=estimated
        )
        trigger.status = 2
        trigger.save()
    elif trigger is not None:
        trigger.status = 3
        trigger.save()


@background(schedule=60)
def move_product(trigger_id, product_id, from_warehouse_id, to_warehouse_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        product = None
    try:
        from_warehouse = Warehouse.objects.get(id=from_warehouse_id)
        to_warehouse = Warehouse.objects.get(id=to_warehouse_id)
    except Warehouse.DoesNotExist:
        from_warehouse = None
        to_warehouse = None
    try:
        trigger = Trigger.objects.get(id=trigger_id)
    except Trigger.DoesNotExist:
        trigger = None

    if product is not None and trigger is not None and\
            from_warehouse is not None and to_warehouse is not None and from_warehouse_id != to_warehouse_id:
        product.warehouse = to_warehouse
        product.save()
        trigger.status = 3
        trigger.save()
    elif trigger is not None:
        trigger.status = 3
        trigger.save()
