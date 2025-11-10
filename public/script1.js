async function getMedicine() {
  const input = document.getElementById("diseaseInput");
  const symptom = input.value.trim();

  if (!symptom) {
    alert("Please enter a symptom or disease!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Server returned error:", errorData);
      alert("Server error! Please check the backend logs.");
      return;
    }

    const data = await response.json();

    const remediesDiv = document.getElementById("remedies-list");
    const compositionDiv = document.getElementById("composition-list");
    const companyDiv = document.getElementById("company-list");
    const usageDiv = document.getElementById("usage-list");
    const imageDiv = document.getElementById("image-list");

    // Reset placeholders
    remediesDiv.innerHTML = "Enter a disease to see suggestions.";
    compositionDiv.innerHTML = "Details will appear here.";
    companyDiv.innerHTML = "Company details will appear here.";
    usageDiv.innerHTML = "Usage info will appear here.";
    imageDiv.innerHTML = "image will appear here.";

    if (!Array.isArray(data) || data.length === 0) {
      remediesDiv.innerHTML = "<p>No medicines found for this symptom.</p>";
      return;
    }

    // Display remedies as text (not list)
    let remediesText = "";
    data.forEach((item) => {
      remediesText += `<div style="margin-bottom:10px;">
        <strong>${escapeHtml(item.medicine_name)}</strong><br>

      </div>`;
    });

    remediesDiv.innerHTML = remediesText;

    // Show the first medicine’s details in boxes
    const first = data[0];
    compositionDiv.innerHTML = first.ingredients.length
      ? escapeHtml(first.ingredients.join(", "))
      : "N/A";
    companyDiv.innerHTML = first.companies.length
      ? escapeHtml(first.companies.join(", "))
      : "N/A";
    usageDiv.innerHTML = first.usage_info
      ? escapeHtml(first.usage_info)
      : "N/A";
    imageDiv.innerHTML = first.image_url
      ? `<img src="${escapeHtml(first.image_url)}" alt="medicine" style="width:100px;height:auto;border-radius:8px;">`
      : "image will appear here.";

  } catch (err) {
    console.error("Error fetching data:", err);
    alert("Something went wrong. Check console for details.");
  }
}

// small helper to avoid XSS in innerHTML
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.getElementById("diseaseInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getMedicine();
  }
});

document.querySelector("button[onclick='getMedicine()']")?.addEventListener("click", getMedicine);









//working code...............

// async function getMedicine() {
//   const input = document.getElementById("diseaseInput");
//   const symptom = input.value.trim();

//   if (!symptom) {
//     alert("Please enter a symptom or disease!");
//     return;
//   }

//   try {
//     const response = await fetch(`http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`);

//     if (!response.ok) {
//       const errorData = await response.json().catch(()=>({}));
//       console.error("Server returned error:", errorData);
//       alert("Server error! Please check the backend logs.");
//       return;
//     }

//     const data = await response.json();

//     const remediesDiv = document.getElementById("remedies-list");
//     const compositionDiv = document.getElementById("composition-list");
//     const companyDiv = document.getElementById("company-list");
//     const usageDiv = document.getElementById("usage-list");

//     // Reset
//     console.log("remediesDiv is", remediesDiv);

//     remediesDiv.innerHTML = "Enter a disease to see suggestions.";
//     if (remediesDiv) remediesDiv.innerHTML = "Enter a disease to see suggestions.";

//     compositionDiv.innerHTML = "Details will appear here.";
//     companyDiv.innerHTML = "Company details will appear here.";
//     usageDiv.innerHTML = "Usage info will appear here.";

//     if (!Array.isArray(data) || data.length === 0) {
//       remediesDiv.innerHTML = "<p>No medicines found for this symptom.</p>";
//       return;
//     }

//  //   Group results by medicine (they already should be unique by medicine_id)
//     const listEl = document.createElement("ul");

//     data.forEach(item => {
//       const li = document.createElement("li");

//       const title = document.createElement("div");
//       title.innerHTML = `<strong>${escapeHtml(item.medicine_name)}</strong>`;

//       const comp = document.createElement("div");
//       comp.innerHTML = `<strong>Composition / Ingredients:</strong> ${item.ingredients.length ? escapeHtml(item.ingredients.join(", ")) : "N/A"}`;

//       const compList = document.createElement("div");
//       compList.style.marginTop = "4px";

//       const company = document.createElement("div");
//       company.innerHTML = `<strong>Company:</strong> ${item.companies.length ? escapeHtml(item.companies.join(", ")) : "N/A"}`;

//       const usage = document.createElement("div");
//       usage.innerHTML = `<strong>Usage:</strong> ${item.usage_info ? escapeHtml(item.usage_info) : "N/A"}`;

//       li.appendChild(title);
//       li.appendChild(company);
//       li.appendChild(comp);
//       li.appendChild(usage);
//       li.style.marginBottom = "12px";

//       listEl.appendChild(li);
//     });

//     // Place into the 'remedies' area, and also populate separate sections (optional)
//     // document.getElementById("remedies").querySelector("p")?.remove();
//     document.getElementById("remedies").appendChild(listEl);

//     // Optionally aggregate composition/company/usage for the first result (or show all)
//     const first = data[0];
//     compositionDiv.innerHTML = first.ingredients.length ? escapeHtml(first.ingredients.join(", ")) : "N/A";
//     companyDiv.innerHTML = first.companies.length ? escapeHtml(first.companies.join(", ")) : "N/A";
//     usageDiv.innerHTML = first.usage_info ? escapeHtml(first.usage_info) : "N/A";

//   } catch (err) {
//     console.error("Error fetching data:", err);
//     alert("Something went wrong. Check console for details.");
//   }
// }

// // small helper to avoid XSS in innerHTML
// function escapeHtml(str) {
//   if (!str && str !== 0) return "";
//   return String(str)
//     .replace(/&/g, "&amp;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#39;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");
// }

// document.getElementById("diseaseInput").addEventListener("keypress", function (event) {
//   if (event.key === "Enter") {
//     getMedicine();
//   }
// });

// document.querySelector("button[onclick='getMedicine()']")?.addEventListener("click", getMedicine);


























// async function getMedicine() {
//   const input = document.getElementById("diseaseInput");
//   const symptom = input.value.trim();

//   if (!symptom) {
//     alert("Please enter a symptom or disease!");
//     return;
//   }

//   try {
//     const response = await fetch(`http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`);

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Server returned error:", errorData);
//       alert("Server error! Please check the backend logs.");
//       return;
//     }

//     const data = await response.json();

//     const remediesDiv = document.getElementById("remedies");
//     const compositionDiv = document.getElementById("composition");
//     const companyDiv = document.getElementById("company");
//     const usageDiv = document.getElementById("useInfo");

//     remediesDiv.innerHTML = "";
//     compositionDiv.innerHTML = "";
//     companyDiv.innerHTML = "";
//     usageDiv.innerHTML = "";

//     if (data.length === 0) {
//       remediesDiv.innerHTML = "<p>No medicines found for this symptom.</p>";
//       return;
//     }

//     let html = "<ul>";
//     data.forEach((item) => {
//       html += `
//         <li>
//           <strong>Medicine:</strong> ${item.Medicine_Name}<br>
//           <strong>Company:</strong> ${item.Company}<br>
//           <strong>Composition:</strong> ${item.Composition}<br>
//           <strong>Usage:</strong> ${item.Usage_Info}<br><br>
//         </li>
//       `;
//     });
//     html += "</ul>";

//     remediesDiv.innerHTML = html;

//   } catch (err) {
//     console.error("Error fetching data:", err);
//     alert("Something went wrong. Check console for details.");
//   }
// }

// document.getElementById("diseaseInput").addEventListener("keypress", function (event) {
//   if (event.key === "Enter") {
//     getMedicine();
//   }
// });







// // script1.js

// async function getMedicine() {
//   const symptomInput = document.getElementById("diseaseInput"); // ✅ fix here
//   const symptom = symptomInput.value.trim();

//   if (!symptom) {
//     alert("Please enter a symptom or disease name!");
//     return;
//   }

//   try {
//     const response = await fetch(`http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`);

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Server returned error:", errorData);
//       alert("Server error! Please check the backend logs.");
//       return;
//     }

//     const data = await response.json();

//     const remediesDiv = document.getElementById("remedies");
//     const compositionDiv = document.getElementById("composition");
//     const companyDiv = document.getElementById("company");
//     const usageDiv = document.getElementById("useInfo");

//     remediesDiv.innerHTML = "";
//     compositionDiv.innerHTML = "";
//     companyDiv.innerHTML = "";
//     usageDiv.innerHTML = "";

//     if (data.length === 0) {
//       remediesDiv.innerHTML = "<p>No medicines found for this symptom.</p>";
//       return;
//     }

//     const remediesList = document.createElement("ul");
//     data.forEach((item) => {
//       const li = document.createElement("li");
//       li.innerHTML = `
//         <strong>Medicine:</strong> ${item.Medicine_Name}<br>
//         <strong>Company:</strong> ${item.Company}<br>
//         <strong>Composition:</strong> ${item.Composition}<br>
//         <strong>Usage:</strong> ${item.Usage_Info}<br><br>
//       `;
//       remediesList.appendChild(li);
//     });

//     remediesDiv.appendChild(remediesList);

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     alert("Network or server error. Please check console.");
//   }
// }

// // ✅ fix here
// document.getElementById("diseaseInput").addEventListener("keypress", function (event) {
//   if (event.key === "Enter") {
//     getMedicine();
//   }
// });




// // script1.js
// async function getMedicine() {
//   const symptom = document.getElementById("diseaseInput").value.trim();

//   if (!symptom) {
//     alert("Please enter a symptom or disease!");
//     return;
//   }

//   try {
//     const response = await fetch(
//       `http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`
//     );

//     // If response is not JSON (error), handle it
//     if (!response.ok) {
//       const text = await response.text();
//       console.error("❌ Server returned error:", text);
//       alert("Server error! Please check the backend logs.");
//       return;
//     }

//     const data = await response.json();

//     // ✅ Ensure we got an array
//     if (!Array.isArray(data) || data.length === 0) {
//       document.getElementById("remedies-list").innerText = "No remedies found.";
//       document.getElementById("composition-list").innerText = "";
//       document.getElementById("company-list").innerText = "";
//       document.getElementById("usage-list").innerText = "";
//       return;
//     }

//     // ✅ Remove duplicates (by medicine name)
//     const uniqueData = data.filter(
//       (item, index, self) =>
//         index === self.findIndex((t) => t.Medicine_Name === item.Medicine_Name)
//     );

//     // ✅ Prepare output HTML
//     let remediesHTML = "";
//     let compositionHTML = "";
//     let companyHTML = "";
//     let usageHTML = "";

//     uniqueData.forEach((med) => {
//       remediesHTML += `<p><strong>${med.Medicine_Name}</strong></p>`;
//       compositionHTML += `<p>${med.Composition || "N/A"}</p>`;
//       companyHTML += `<p>${med.Company || "N/A"}</p>`;
//       usageHTML += `<p>${med.Usage_Info || "N/A"}</p>`;
//     });

//     // ✅ Update DOM
//     document.getElementById("remedies-list").innerHTML = remediesHTML;
//     document.getElementById("composition-list").innerHTML = compositionHTML;
//     document.getElementById("company-list").innerHTML = companyHTML;
//     document.getElementById("usage-list").innerHTML = usageHTML;

//   } catch (err) {
//     console.error("⚠️ Error fetching data:", err);
//     alert("Failed to fetch data. Check if server is running on port 5000.");
//   }
// }

// // Optional logout placeholder
// function logout() {
//   alert("Logout functionality not yet implemented!");
// }







// async function getMedicine() {
//   const symptom = document.getElementById("diseaseInput").value.trim();
//   if (!symptom) {
//     alert("Please enter a symptom or disease!");
//     return;
//   }

//   try {
//     const response = await fetch(`http://localhost:5000/api/medicines?symptom=${encodeURIComponent(symptom)}`);
//     const data = await response.json();

//     if (data.length === 0) {
//       document.getElementById("remedies-list").innerText = "No remedies found.";
//       document.getElementById("composition-list").innerText = "";
//       document.getElementById("company-list").innerText = "";
//       document.getElementById("usage-list").innerText = "";
//       return;
//     }

//     // ✅ Remove duplicate medicines by name
//     const uniqueData = data.filter(
//       (item, index, self) =>
//         index === self.findIndex((t) => t.Medicine_Name === item.Medicine_Name)
//     );

//     // ✅ Prepare HTML output
//     let remediesHTML = "";
//     let compositionHTML = "";
//     let companyHTML = "";
//     let usageHTML = "";

//     uniqueData.forEach((med) => {
//       remediesHTML += `<p><strong>${med.Medicine_Name}</strong></p>`;
//       compositionHTML += `<p>${med.Composition || "N/A"}</p>`;
//       companyHTML += `<p>${med.Company || "N/A"}</p>`;
//       usageHTML += `<p>${med.Usage_Info || "N/A"}</p>`;
//     });

//     // ✅ Inject into HTML
//     document.getElementById("remedies-list").innerHTML = remediesHTML;
//     document.getElementById("composition-list").innerHTML = compositionHTML;
//     document.getElementById("company-list").innerHTML = companyHTML;
//     document.getElementById("usage-list").innerHTML = usageHTML;

//   } catch (err) {
//     console.error("Error fetching data:", err);
//     alert("Something went wrong while fetching medicines.");
//   }
// }
