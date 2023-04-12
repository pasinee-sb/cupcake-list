from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import InputRequired, URL, Optional
import wtforms_json
from wtforms import Form
wtforms_json.init()


class AddCupcake(FlaskForm):
    flavor = StringField("Flavor", validators=[
        InputRequired(message="Please add flavor")])
    image = StringField("Image URL", validators=[URL(), Optional()])
    size = StringField("Size", validators=[
        InputRequired(message="Please add size")])
    rating = FloatField("Rating", validators=[
        InputRequired(message="Please add rating")])
