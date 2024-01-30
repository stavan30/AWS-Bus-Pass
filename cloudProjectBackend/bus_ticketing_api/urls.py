from rest_framework import routers

from bus_ticketing_api import views
from ticket import views as ticket_views

api_router = routers.DefaultRouter()
api_router.register(r'places', views.PlacesListAPIView, basename='places')
api_router.register(r'schedules/search', views.RoutesSearchAPIView, basename='schedules_search')
api_router.register(r'schedule', views.BusScheduleInfoAPIView, basename='schedule_get')


api_router.register(r'checkout', ticket_views.CheckoutView, basename='bus')
api_router.register(r'seating', ticket_views.SeatingPlanView, basename='seating')

api_router.register(r'register', views.CreateUserView, basename='register')
api_router.register(r'user', views.UserView, basename='details')
api_router.register(r'tickets', views.MyTicketsView, basename='tickets')