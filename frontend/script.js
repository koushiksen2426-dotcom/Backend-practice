let title = document.querySelector(".title");
let name = document.querySelector(".name");
let button = document.querySelector(".button");
let account_statement = document.querySelector(".account-statement");
let account_link = document.querySelector(".account-link");
let varifier = document.querySelector(".varifier")
let account_img = document.querySelector(".account-img")

let isLogin = false;

button.addEventListener("click", () => {
  console.log("Button clicked!");
});


account_link.addEventListener("click", (e) => {
  e.preventDefault()

  if (account_link.innerHTML.trim() === "Log in") {
    isLogin = true;
    title.innerHTML = "Log in";
    name.style.display = "none";
    button.innerText = "Log In";
    account_statement.innerHTML = "Have no account?";
    account_link.innerText = "Sign Up";
  }
  else {
    isLogin = false;
    title.innerHTML = "Sign up";
    name.style.display = "block";
    button.innerText = "Sign up";
    account_statement.innerHTML = "Have an account?";
    account_link.innerText = "Log in";
  }




})



account_img.addEventListener("click", () => {
  varifier.classList.toggle("show");
});


let email = document.querySelector(".email");
let password = document.querySelector(".password");
let form = document.querySelector(".form");


form.addEventListener("submit", async (e) => {
  e.preventDefault()





  const response = await fetch(

    `https://backend-practice-pa0w.onrender.com/api/auth/${isLogin ? "login" : "register"}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })

    }

  )


  console.log("Form submitted!");

  const data = await response.json();

  alert(data.message);
  console.log("Success value:", data.success);

  let logout_btn = document.querySelector(".logout-btn");


  if (data.success && data.token) {
    localStorage.setItem("token", data.token);
    logout_btn.style.display = "block";
    account_img.style.display = "none";
    const token = localStorage.getItem("token");

    const profileResponse = await fetch(
      "httpss://backend-practice-pa0w.onrender.com/api/auth/profile",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const profileData = await profileResponse.json();

    console.log("Profile response:", profileData);
  }

  if (data.success === true) {
    form.reset();
    varifier.classList.remove("show");
  }

  console.log(data);

})

let logout_btn = document.querySelector(".logout-btn");

if (localStorage.getItem("token")) {
  logout_btn.style.display = "block";
} else {
  logout_btn.style.display = "none";
}

logout_btn.addEventListener("click", () => {
  localStorage.removeItem("token");
  alert("Logged out successfully!");

  logout_btn.style.display = "none";
  account_img.style.display = "block";
});

async function showItem() {
  const response = await fetch("https://backend-practice-pa0w.onrender.com/api/items/list");

  const data = await response.json();

  const show_item = document.querySelector(".show-item");

  show_item.innerHTML = "";

  data.items.forEach((item) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = `https://backend-practice-pa0w.onrender.com/uploads/${item.image}`;
    console.log(item);
    console.log(img.src);
    const name = document.createElement('h3');
    name.textContent = item.name;
    div.appendChild(name);
    div.appendChild(img);
    show_item.appendChild(div);
  });


}

showItem();

async function removeItem(item) {
  const response = await fetch(`https://backend-practice-pa0w.onrender.com/api/items/${item._id}`, {
    method: "DELETE"
  })
  const data = await response.json();

  if (data.success) {
    item.remove();
  }




}





// heisenberg3512@gmail.com