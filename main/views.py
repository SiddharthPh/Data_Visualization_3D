from django.shortcuts import render,HttpResponse
import pandas as pd
# Create your views here.
def homepage(request):
    df=pd.read_csv("Sensor_status.csv")
    context={
        'sensorid':list(df['SensorId']),
        'sensorstatus':list(df['Sensor_Status']),
    }
    print(list(df['SensorId']))
    return render(request,"main/main.html",context)