from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from accounts.forms import UserAdminChangeForm, UserAdminCreationForm

# Register your models here.
User = get_user_model()


class UserAdmin(BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    # Shown inside user's account
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('last_name', 'first_name', 'patronymic', 'mobile_phone', 'birthday')}),
        ('Permissions', {'fields': ('is_superuser', 'is_active',)}),
    )
    # Shown while adding a user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'last_name',
                'first_name',
                'patronymic',
                'mobile_phone',
                'birthday',
                'password1',
                'password2',
                'is_superuser',
                'is_active'
            )
        }),
    )
    # Shown on accounts page
    list_display = ('email', 'last_name', 'first_name', 'patronymic', 'mobile_phone', 'is_superuser', 'is_active')
    list_filter = ()
    search_fields = ('email', 'last_name', 'first_name', 'patronymic', 'mobile_phone', 'birthday')
    ordering = ('last_name', 'first_name', 'patronymic')
    filter_horizontal = ()


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
