from mongoengine import Document, StringField, DateTimeField
from datetime import datetime


class ActivityLog(Document):
    user = StringField(required=True)
    action = StringField(required=True)
    task_id = StringField(required=True)
    timestamp = DateTimeField(default=datetime.utcnow)
