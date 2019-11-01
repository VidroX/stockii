from django.contrib.auth.base_user import BaseUserManager


# Managers
class UserManager(BaseUserManager):
    def create_user(self, email, mobile_phone, password, last_name,
                    first_name, patronymic, birthday, is_active=True, is_superuser=False):
        if not email:
            raise ValueError("E-Mail cannot be empty!")
        if not mobile_phone:
            raise ValueError("Mobile phone cannot be empty!")
        if not password:
            raise ValueError("Password cannot be empty!")
        if not last_name:
            raise ValueError("Last name cannot be empty!")
        if not first_name:
            raise ValueError("First name cannot be empty!")
        if not patronymic:
            raise ValueError("Patronymic cannot be empty!")
        if not birthday:
            raise ValueError("Birthday cannot be empty!")

        user = self.model(
            email=self.normalize_email(email),
            mobile_phone=mobile_phone,
            last_name=last_name,
            first_name=first_name,
            patronymic=patronymic,
            birthday=birthday,
            is_active=is_active,
            is_superuser=is_superuser
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, mobile_phone, password, last_name, first_name, patronymic, birthday):
        user = self.create_user(
            email=self.normalize_email(email),
            mobile_phone=mobile_phone,
            password=password,
            last_name=last_name,
            first_name=first_name,
            patronymic=patronymic,
            birthday=birthday,
            is_active=True,
            is_superuser=True
        )
        return user
