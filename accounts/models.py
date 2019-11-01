from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from accounts.managers import UserManager


# Create your models here.
class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    mobile_phone = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255)
    birthday = models.DateField()
    date_joined = models.DateTimeField(auto_now=False, auto_now_add=True)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['mobile_phone', 'first_name', 'last_name', 'patronymic', 'birthday']

    objects = UserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.last_name + " " + self.first_name + " " + self.patronymic

    def get_short_name(self):
        return self.first_name

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return True
