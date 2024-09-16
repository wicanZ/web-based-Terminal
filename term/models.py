from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# class MyUserManager(BaseUserManager):
#     def create_user(self, email, username, password=None, **extra_fields):
#         if not email:
#             raise ValueError('The Email field must be set')
#         email = self.normalize_email(email)
#         user = self.model(email=email, username=username, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, username, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)

#         return self.create_user(email, username, password, **extra_fields)

# class MyUser(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True)
#     username = models.CharField(max_length=255, unique=True)
#     first_name = models.CharField(max_length=255)
#     last_name = models.CharField(max_length=255)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     date_joined = models.DateTimeField(auto_now_add=True)

#     objects = MyUserManager()

#     USERNAME_FIELD = 'email'  # Use email to log in
#     REQUIRED_FIELDS = ['username']

#     def __str__(self):
#         return self.email
    

class QuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.score}'


class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    date = models.DateField()

    def __str__(self):
        return f'{self.text} on {self.date}'
    
class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    datetime = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=[('success', 'Success'), ('fail', 'Fail')])

    def __str__(self):
        return f'{self.user.username} - {self.amount} - {self.status} - {self.datetime}'

class App(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    version = models.CharField(max_length=10)
    size = models.IntegerField()  # Size in KB or MB
    developer = models.CharField(max_length=100)
    download_url = models.URLField()
    
    def __str__(self):
        return self.name

class InstalledApp(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    app = models.ForeignKey(App, on_delete=models.CASCADE)
    installed_at = models.DateTimeField(auto_now_add=True)
    version = models.CharField(max_length=10)
    
    def __str__(self):
        return f"{self.app.name} - {self.user.username}"
    

    
from django.core.exceptions import ValidationError

class Command(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Command name must be unique
    description = models.TextField()
    code = models.TextField()  # Store the command's code
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_default = models.BooleanField(default=False)  # True if it's a system/default command

    def save(self, *args, **kwargs):
        if self.is_default:
            raise ValidationError("You cannot modify default commands.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.is_default:
            raise ValidationError("You cannot delete default commands.")
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name
    


class UserCommand(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to the user
    file_name = models.CharField(max_length=100, unique=True)  # Command file name (e.g., report.js)
    command_file = models.FileField(upload_to='commands/')  # The command file itself
    description = models.TextField(blank=True)  # Optional description of the command
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the command is created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when the command is last updated

    def __str__(self):
        return f'{self.file_name} by {self.user.username}'



class Report(models.Model):
    content = models.TextField()  # The text of the report
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set when the report is created
    line_number = models.IntegerField()  # Line number where the report originated

    def __str__(self):
        return f"Report {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"