async function getMedicine() {
  const symptom = document.getElementById("diseaseInput").value.trim();
  if (!symptom) {
    alert("Please enter a symptom or disease!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`);
    const data = await response.json();

    if (data.length === 0) {
      document.getElementById("remedies-list").innerText = "No remedies found.";
      document.getElementById("composition-list").innerText = "";
      document.getElementById("company-list").innerText = "";
      document.getElementById("usage-list").innerText = "";
      return;
    }

    // Show all medicines for the symptom
    let remediesHTML = "";
    let compositionHTML = "";
    let companyHTML = "";
    let usageHTML = "";

    data.forEach((med) => {
      remediesHTML += `<p><strong>${med.Medicine_Name}</strong></p>`;
      compositionHTML += `<p>${med.Composition || "N/A"}</p>`;
      companyHTML += `<p>${med.Company || "N/A"}</p>`;
      usageHTML += `<p>${med.Usage_Info || "N/A"}</p>`;
    });

    document.getElementById("remedies-list").innerHTML = remediesHTML;
    document.getElementById("composition-list").innerHTML = compositionHTML;
    document.getElementById("company-list").innerHTML = companyHTML;
    document.getElementById("usage-list").innerHTML = usageHTML;

  } catch (err) {
    console.error("Error fetching data:", err);
    alert("Something went wrong while fetching medicines.");
  }
}


// async function getMedicine() {
//     const symptom = document.getElementById("diseaseInput").value.trim();
//     if (!symptom) {
//       alert("Please enter a symptom or disease!");
//       return;
//     }
  
//     try {
//       const response = await fetch(`http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`);
//       const data = await response.json();
  
//       if (data.length === 0) {
//         document.getElementById("remedies-list").innerText = "No remedies found.";
//         document.getElementById("composition-list").innerText = "";
//         document.getElementById("company-list").innerText = "";
//         document.getElementById("usage-list").innerText = "";
//         document.getElementById("image-list").innerHTML = "";
//         return;
//       }
  
//       // Display first medicine result (or loop through all if needed)
//       const med = data[0];
//       document.getElementById("remedies-list").innerText = med.Medicine_Name;
//       document.getElementById("composition-list").innerText = med.Composition;
//       document.getElementById("company-list").innerText = med.Company;
//       document.getElementById("usage-list").innerText = med.Usage_info;
//       document.getElementById("image-list").innerHTML = med.Image
//         ? `<img src="${med.Image}" alt="${med.Medicine_Name}" width="150">`
//         : "No image available.";
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       alert("Error fetching medicine data!");
//     }
//   }
  
//   function logout() {
//     alert("Logout successful!");
//     window.location.href = "index.html";
//   }
  