from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
#from .models import MyUser
from .models import QuizResult ,Event , Command , UserCommand ,Report 
# Register your models here.

admin.site.register(QuizResult)

admin.site.register( Event )
admin.site.register(Report)
admin.site.register(UserCommand)
@admin.register(Command)
class CommandAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'is_default')
    search_fields = ('name',)
    readonly_fields = ('is_default', 'created_by')

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.is_default:
            return self.readonly_fields + ('name', 'description', 'code')
        return self.readonly_fields


# class UserAdmin(BaseUserAdmin):
#     ordering = ['email']
#     list_display = ['email', 'username', 'first_name', 'last_name', 'is_staff']
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Personal Info', {'fields': ('first_name', 'last_name', 'username')}),
#         ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
#         ('Important dates', {'fields': ('last_login', 'date_joined')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'username', 'password1', 'password2'),
#         }),
#     )
#     search_fields = ('email', 'username')

# admin.site.register(MyUser, UserAdmin)
