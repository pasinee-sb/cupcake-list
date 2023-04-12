"""Flask app for Cupcakes"""

from flask import Flask, request, jsonify, render_template, redirect

from form import AddCupcake

from models import db, connect_db, Cupcake

app = Flask(__name__)
app.app_context().push()

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcake_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "oh-so-secret"


connect_db(app)


@app.route('/')
def index_page():
    """Renders html template that includes some JS - NOT PART OF JSON API!"""

    return render_template('index.html')


@app.route('/api/cupcakes', methods=['GET'])
def get_all_cupcakes():
    """Render all cupcakes"""
    cupcakes = Cupcake.query.all()
    all_cupcakes = [cupcake.serialize() for cupcake in cupcakes]
    return jsonify(cupcakes=all_cupcakes)


@app.route('/api/cupcakes/<int:cupcake_id>')
def each_cupcake_data(cupcake_id):
    """Get data about each cupcake"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)

    return jsonify(cupcake=cupcake.serialize())


@app.route('/api/cupcakes', methods=['POST'])
def add_cupcakes():
    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]

    """set value image to None to trigger default value if no image provided+"""
    image = request.json.get("image", None)

    new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)
    db.session.add(new_cupcake)
    db.session.commit()

    response_json = jsonify(cupcake=new_cupcake.serialize())

    return (response_json, 201)


@app.route('/api/cupcakes/<int:cupcake_id>', methods=['PATCH'])
def update_cupcake(cupcake_id):
    """update cupcake"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)

    db.session.commit()

    response_json = jsonify(cupcake=cupcake.serialize())

    return response_json


@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message="Deleted")
