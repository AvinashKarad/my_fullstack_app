from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from backend.app.views import create_student, list_students, view_student, update_student, delete_student

def test_api(request):
    return JsonResponse({"message": "Hello from first Django and MySQL!"})

def home(request):
    return JsonResponse({"message": "Welcome to the first Django Backend!"})

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin route
    path('api/test/', test_api),  # Test API endpoint
    path('', home),  # Root URL
    path('api/students/create/', create_student, name='create_student'),  # Create student
    path('api/students/', list_students, name='list_students'),  # List students
    path('api/students/<int:student_id>/', view_student, name='view_student'),  # View student
    path('api/students/<int:student_id>/update/', update_student, name='update_student'),  # Update student
    path('api/students/<int:student_id>/delete/', delete_student, name='delete_student'),  # Delete student
]