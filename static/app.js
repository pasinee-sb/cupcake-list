
const BASE_URL = "http://127.0.0.1:5000/api";


/** given data about a cupcake, generate html */
function generateCupcakeHTML(cupcake) {
    return `<tr data-id=${cupcake.id}>
       
    <td>${cupcake.flavor}</td>
    <td><img class="pic" width = "100px"height = "auto"src=" ${cupcake.image}" alt="cupcake"></td>
    <td>${cupcake.size}</td>
    <td>${cupcake.rating} </td>
    <td>
      <button type="button" class="btn btn-success edit-btn"><i class="fa-solid fa-pencil"></i></button>
    <button type="button" class="btn btn-danger delete-btn"><i class="fa-solid fa-trash-can"></i></button>
    </td>
    
    </tr>`;
  }


/** put initial cupcakes on page. */

async function showInitialCupcakes() {
  const response = await axios.get(`${BASE_URL}/cupcakes`);

  for (let cupcakeData of response.data.cupcakes) {
    let newCupcake = $(generateCupcakeHTML(cupcakeData));
    $(".cupcake-list").append(newCupcake);
  }

}


/** handle form for adding of new cupcakes */

$("#add-cupcake").on("click", async function (evt) {
  evt.preventDefault();
  let image

  let flavor = $("#flavor").val();
  let rating = $("#rating").val();
  let size = $("#size").val();
  let img = $("#image").val();

    if (img == ""){
    image = null
  }
    else{
    image = img
  }


    

  const newCupcakeResponse = await axios.post(`${BASE_URL}/cupcakes`, {
    flavor,
    rating,
    size,
    image
  });

  let newCupcake = $(generateCupcakeHTML(newCupcakeResponse.data.cupcake));
  $(".cupcake-list").append(newCupcake);
  $("#cupcake-form").trigger("reset");
 
});


/** handle clicking delete: delete cupcake */

$(".cupcake-list").on("click", ".delete-btn", async function (evt) {
  evt.preventDefault();
  let $cupcake = $(evt.target).closest("tr");
  let cupcakeId = $cupcake.attr("data-id");

  await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
  $cupcake.remove();
});

/**handle edit button */

async function showEdit(evt){
    evt.preventDefault()
 
    let $cupcake = $(evt.target).closest("tr")
    let cupcakeId = $cupcake.attr("data-id");
    const response = await axios.get(`${BASE_URL}/cupcakes/${cupcakeId}`)
    
let res = response.data.cupcake;

$("#flavor").val(res.flavor)
$("#rating").val(res.rating);
$("#size").val(res.size);
$("#image").val(res.image);
let id = parseInt(res.id)

$("#add-cupcake").hide()

let $save_button = $(`<button type="submit" data_id=${id} id="save-edit-cupcake"class="btn  btn-success  btn-sm" >Save</button>`)
$("#cupcake-form").append($save_button)
$("#cupcake-form").attr("method","patch")
console.log($("#cupcake-form").attr("method"));
}

async function patchEdit(evt){
    evt.preventDefault();
    let button = $(evt.target)
    let id = button.attr("data_id")
    let image

    let flavor = $("#flavor").val();
    let rating = $("#rating").val();
    let size = $("#size").val();
    let img = $("#image").val();
    
    if (img == ""){
      image = null
    }
      else{
      image = img
    }

    await axios.patch(`${BASE_URL}/cupcakes/${id}`, {
        flavor,
        rating,
        size,
        image
      })

      


  $("#cupcake-form").trigger("reset");
  $("#save-edit-cupcake").hide()
  $("#add-cupcake").show()

$("#cupcake-form").attr("method","post")
console.log($("#cupcake-form").attr("method"));



$(showInitialCupcakes)





}
   
$("#cupcake-form").on("click", "#save-edit-cupcake", patchEdit)
    

$(".cupcake-list").on("click", ".edit-btn", showEdit)


$(showInitialCupcakes);

