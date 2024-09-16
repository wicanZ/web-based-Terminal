# Generated by Django 5.1.1 on 2024-09-14 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('term', '0003_app_command_installedapp_payment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('line_number', models.IntegerField()),
            ],
        ),
    ]
