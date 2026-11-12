
let add_btn = document.querySelector(".add-btn");
let manage_btn = document.querySelector(".manage-btn");

let add_section = document.querySelector(".add-section");

add_btn.addEventListener("click", () => {
  manage_section.style.display = "none";
  add_section.style.display = "block";

  document.querySelector(".add-section h2").textContent = "Add New Item";

  item_name.style.display = "block";
  item_image.style.display = "block";
  save_btn.style.display = "block";
});

let manage_section = document.querySelector(".manage-section");

manage_btn.addEventListener("click", () => {
  add_section.style.display = "none";
  manage_section.style.display = "block";
});

let save_btn = document.querySelector(".save-btn");
let item_name = document.querySelector(".item-name");
let item_image = document.querySelector(".item-image");
let item_list = document.querySelector(".item-list");
let manage_list = document.querySelector(".manage-list");

save_btn.addEventListener("click", async (e) => {
  e.preventDefault();

  let name = item_name.value;
  let image = item_image.files[0];

  if (name === "" || !image) {
    alert("Please enter item name and select an image!");
    return;
  }

  let li = document.createElement("li");
  let img = document.createElement("img");

  img.src = URL.createObjectURL(image);
  img.width = 100;

  li.textContent = name;
  li.appendChild(img);

  item_list.appendChild(li);

  let manage_li = li.cloneNode(true);
  let manage_delete_btn = document.createElement("button");

  manage_delete_btn.textContent = "Delete";

  manage_delete_btn.addEventListener("click", () => {
    li.remove();
    manage_li.remove();
  });

  manage_li.appendChild(manage_delete_btn);

  let edit_btn = document.createElement("button");

  edit_btn.textContent = "Edit";

  edit_btn.addEventListener("click", () => {
    let new_name = prompt("Enter new item name:");

    if (new_name !== null && new_name.trim() !== "") {
      li.firstChild.textContent = new_name;
      manage_li.firstChild.textContent = new_name;
    }

    let change_image = confirm("Do you want to change the image?");

    if (change_image) {
      let new_image_input = document.createElement("input");
      new_image_input.type = "file";
      new_image_input.accept = "image/*";

      new_image_input.addEventListener("change", () => {
        let new_image = new_image_input.files[0];

        if (new_image) {
          li.querySelector("img").src = URL.createObjectURL(new_image);
          manage_li.querySelector("img").src = li.querySelector("img").src;
        }
      });

      new_image_input.click();
    }
  });

  manage_li.appendChild(edit_btn);
  manage_list.appendChild(manage_li);

  const formData = new FormData();

  formData.append("name", item_name.value);
  formData.append("image", item_image.files[0]);

  const response = await fetch("https://backend-practice-pa0w.onrender.com/api/items/add", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  alert(data.message);

  item_name.value = "";
  item_image.value = "";

  loadItems();
});

async function loadItems() {
  const response = await fetch("https://backend-practice-pa0w.onrender.com/api/items/list");
  const data = await response.json();

  manage_list.innerHTML = "";

  data.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;

    const manage_delete_btn = document.createElement("button");
    manage_delete_btn.textContent = "Delete";

    li.appendChild(manage_delete_btn);
    manage_list.appendChild(li);

    manage_delete_btn.addEventListener("click", async () => {
      const response = await fetch(`https://backend-practice-pa0w.onrender.com/api/items/${item._id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (result.success) {
        li.remove();
      }
    });
  });
}

loadItems();
