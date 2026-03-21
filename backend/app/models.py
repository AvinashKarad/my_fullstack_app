# filepath: c:\Users\Karad\my_fullstack_app\backend\app\models.py
from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=255)
    contact_no = models.CharField(max_length=15)
    school_name = models.CharField(max_length=255)

    def __str__(self):
        return self.name