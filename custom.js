document.addEventListener('DOMContentLoaded', function() {

	// ALL CONSTANTS
	const subtitleOfCertificate = "[[%modal.document? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		bless = '[[%bless? &namespace=`lang` &language=`[[++cultureKey]]`]]',
		punish = '[[%punish? &namespace=`lang` &language=`[[++cultureKey]]`]]',
		blessMaleRandomText = "[[%target.male.bless_[[randomText]]? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		blessFemaleRandomText = "[[%target.female.bless_[[randomText]]? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		blessObjectRandomText = "[[%target.object.bless_[[randomText]]? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		punishMaleRandomText = "[[%target.male.punish_[[randomText]]? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		punishFemaleRandomText = "[[%target.female.punish_[[randomText]]? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		punishObjectRandomText = "[[%target.object.punish_[[randomText]]? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		logoCertificate = "[[#[[++cultureKey:is=`en`:then=`1`]].logoCertificate]]",
		blessImage = "[[#[[++cultureKey:is=`en`:then=`5`]].fileBless]]",
		punishImage = "[[#[[++cultureKey:is=`en`:then=`5`]].filePunish]]",
		badWordsString = "[[%badwords? &namespace=`lang` &language=`[[++cultureKey]]`]]",
		videoAnimation = document.getElementById("animation"),
		siteURL = window.location.href,
		timePause = 3000,
		isReady = false;

	var blessParameter, sexParameter, myCert, captureTimer;



	// BAD WORDS FILTER
	function filterBadWords(text, badWordsString) {
	  // Split the badWordsString into an array of individual bad words
	  var badWords = badWordsString.split(",").map(word => word.trim().toLowerCase());
	  
	  // Split the input text into an array of individual words
	  var words = text.split(" ");
	  
	  // Iterate over each word in the array
	  for (var i = 0; i < words.length; i++) {
		var word = words[i];
		var lowerCaseWord = word.toLowerCase();
		
		// Check if the lowercase version of the word exists in the badWords array
		if (badWords.includes(lowerCaseWord)) {
		  // Replace the word with asterisks (*) of the same length
		  words[i] = "*".repeat(word.length);
		}
	  }
	  
	  // Join the modified words back into a single string with spaces between them
	  var filteredText = words.join(" ");
	  
	  // Return the filtered text
	  return filteredText;
	}



	// CREATE UNIQUE CERTIFICATE ID
	const getRandomCertId = () => {
	  // Generate a random string with 3 characters
	  const randomStr1 = Math.random().toString(36).substr(2, 3);
	
	  // Get the current timestamp and convert it to a string with base 26
	  const timestampStr1 = Date.now().toString(26).substr(7);
	
	  // Generate another random string with 6 characters
	  const randomStr2 = Math.random().toString(36).substr(4, 6);
	
	  // Get the current timestamp and convert it to a string with base 26 (different subset of digits)
	  const timestampStr2 = Date.now().toString(26).substr(3, 7);
	
	  // Concatenate all the generated strings to create a unique certificate ID
	  myCert = randomStr1 + timestampStr1 + randomStr2 + timestampStr2;
	
	  // Return the generated certificate ID
	  return myCert;
	}


	getRandomCertId();


	// CLEAR CERTIFICATE PARAMETERS
	const clearParameter = (param = undefined) => {
		return blessParameter = param;
	}

	clearParameter();


	// SET CERTIFICATE IMAGE
	async function setImgSrc(url) {
	  // Select the image element with the class "img-cert" inside the element with the specified ID
	  const imgCert = document.querySelector(`body #${url} .img-cert`);
	  // Set the "src" attribute of the image element to the certificate image URL
	  await imgCert.setAttribute("src", `${siteURL}assets/certificates/${myCert}.jpg`);
	}



	// CREATE CERTIFICATE
	const createCertificate = (param) => {
	  // Select the <body> element
	  const body = document.querySelector('body');
	  // Create a <div> element
	  const div = document.createElement('div');
	  // Add classes to the <div> based on the parameter value
	  div.classList.add('create-certificate-block', `${param ? "bless-cert" : "punish-cert"}`);
	  // Set the HTML content of the <div> with the certificate details
	  div.innerHTML = `
		<h3 class="modal-title certificate" id="${param ? 'Bless' : 'Punish'}CertificateModalLabel">Certificate <span>of ${param ? "blessing" : "Curse"}</span></h3>
		<h6 class="modal-subtitle">${subtitleOfCertificate}</h6>
		<div class="certificate-modal__text">
		  ${param ? bless : punish}
		  <div class="certificate-modal__text-random">${param ? blessMaleRandomText : punishMaleRandomText}</div>
		</div>
		<div class="certificate-modal__logo">
		  <img src="${logoCertificate}" alt="Logo" class="img-fluid">
		</div>
		<div class="certificate-modal__qr qrcode"></div>
		<img src="${param ? blessImage : punishImage}" alt="Image" class="img-fluid">
	  `;
	  // Append the <div> to the <body>
	  body.appendChild(div);
	}



	// REMOVE CERTIFICATE
	const removeCertificate = () => {
	  // Select all elements with class 'create-certificate-block'
	  const modalLinks = document.querySelectorAll('body .create-certificate-block');
	
	  // Check if any elements are found
	  if (modalLinks) {
		// Iterate over each element
		modalLinks.forEach((modal) => {
		  // Remove the current element from its parent node
		  modal.parentNode.removeChild(modal);
		});
	  }
	}



	// CREATE CERTIFICATE QR CODE
	function createQR() {
	  getRandomCertId(); // Generate a unique certificate ID
	
	  // Create a new QRCode instance and assign it to the variable qrCode
	  const qrCode = new QRCode(document.querySelector(`.certificate-modal__qr.qrcode`), {
		text: `${siteURL}assets/certificates/${myCert}.jpg`, // Set the QR code text to the URL of the certificate image
		width: 180, // Set the width of the QR code
		height: 180, // Set the height of the QR code
		colorDark: "#a9882b", // Set the color of the dark modules (e.g., QR code squares)
		colorLight: "#ffffff", // Set the color of the light modules (e.g., background)
	  });
	
	  return qrCode; // Return the QRCode instance
	}



	// PRESS CERTIFICATE NAME LINK
	const pressNameLinks = document.querySelectorAll(".name-link");
	pressNameLinks.forEach((link) => {
	  link.addEventListener("click", function (e) {
		e.preventDefault();
		const thisElement = this;
	
		clearParameter(); // Clear any existing parameters
		removeCertificate(); // Remove any existing certificate elements
	
		const name = thisElement.querySelector(".name-title").textContent;
		document.querySelector("#BlockTypeModalLabel").textContent = name;
		document.querySelector("#BlockNameModalLabel").textContent = name;
		document.querySelector("#BlockTokenModalLabel").textContent = name;
	
		if (thisElement.classList.contains("bless-block__link")) {
		  createCertificate(true); // Create a blessing certificate
		  updateVideoSources(true); // Update video sources for blessing
		  document.querySelector("#BlessCertificateModalLabel").innerHTML = "Certificate <span>of blessing</span>";
		  createQR(); // Create a QR code for blessing certificate
	
		  return clearParameter(true); // Clear parameters with true flag
		} else {
		  createCertificate(false); // Create a curse certificate
		  updateVideoSources(false); // Update video sources for curse
		  document.querySelector("#PunishCertificateModalLabel").innerHTML = "Certificate <span>of Curse</span>";
		  createQR(); // Create a QR code for curse certificate
	
		  return clearParameter(false); // Clear parameters with false flag
		}
	  });
	});



	// SET ACTIVE BUTTON ON MODALS
	const setActiveButton = (item) => {
	  // Add click event listeners to all elements matching the 'item' selector
	  document.querySelectorAll(item).forEach((element) => {
		element.addEventListener("click", function (e) {
		  e.preventDefault();
	
		  const thisElement = this;
		  const isBlessCert = document.querySelector(".create-certificate-block").classList.contains("bless-cert");
		  const sex = thisElement.innerText;
	
		  // Update the random text based on the selected certificate type and sex
		  document.querySelector(".certificate-modal__text-random").innerText = isBlessCert ? (sex === "Male" ? blessMaleRandomText : (sex === "Female" ? blessFemaleRandomText : blessObjectRandomText)) : (sex === "Male" ? punishMaleRandomText : (sex === "Female" ? punishFemaleRandomText : punishObjectRandomText));
	
		  const btnConfirm = thisElement.closest(".modal-content").querySelector(".btn-confirm");
		  const targetType = document.querySelector("#targetType");
	
		  if (!thisElement.classList.contains("active")) {
			// Remove 'active' class from all elements matching the 'item' selector
			document.querySelectorAll(item).forEach((el) => {
			  el.classList.remove("active");
			});
	
			// Add 'active' class to the clicked element
			thisElement.classList.add("active");
		  } else {
			// Remove 'active' class from the clicked element
			thisElement.classList.remove("active");
		  }
	
		  if (thisElement.classList.contains("active")) {
			if (thisElement.innerText === "Object") {
			  targetType.textContent = "something";
			} else {
			  targetType.textContent = "one";
			}
	
			btnConfirm.removeAttribute("disabled");
		  } else {
			targetType.textContent = "";
			btnConfirm.setAttribute("disabled", "");
		  }
		});
	  });
	};


	setActiveButton(".bless-modal__link");


	// CLEAR ACTIVE BUTTON ON MODALS
	const clearActivedButton = () => {
	  // Remove the 'active' class from all elements with the class 'bless-modal__link'
	  document.querySelectorAll(".bless-modal__link").forEach((el) => {
		el.classList.remove("active");
	  });
	};



	// HIDE CURRENT MODAL
	const hideCurrentModal = () => {
	  // Get the current modal element and hide it using Bootstrap's Modal API
	  bootstrap.Modal.getInstance(document.querySelector('.modal.fade.show')).hide();
	};



	// SET DISABLE ATTRIBUTE FOR CONFIRM BUTTON
	const clearEnabledButtonConfirm = () => {
	  // Select all elements with the class "btn-confirm" and set the "disabled" attribute
	  document.querySelectorAll(".btn-confirm").forEach((el) => {
		el.setAttribute("disabled", "");
	  });
	};



	// PRESS ON CLOSE OR BACK BUTTONS
	const buttonsBackClose = document.querySelectorAll('.btn-close, .btn-back');
	if (buttonsBackClose) {
	  // Iterate over each button
	  buttonsBackClose.forEach((button) => {
		// Add click event listener to the button
		button.addEventListener('click', () => {
		  // Clear the active button state
		  clearActivedButton();
		  // Clear the enabled state of the confirm button
		  clearEnabledButtonConfirm();
		  // Clear the input fields
		  clearInputFields();
		  // Remove the certificate block
		  removeCertificate();
		  // Remove the modal backdrop if it exists
		  document.querySelector(".modal-backdrop")?.remove();
		});
	  });
	}



	// PRESS ON CONFIRM BUTTON
	document.querySelectorAll(".btn-confirm").forEach((item) => {
	  // Add click event listener to each confirm button
	  item.addEventListener("click", () => {
		// Hide the current modal
		hideCurrentModal();
	  });
	});



	// INPUT NAME FIELD
	document.querySelector(".input-name").addEventListener("input", function() {
	  // Handle input event on the name field
	  const thisElement = this;
	
	  const btnConfirm = thisElement.closest(".modal-content").querySelector(".btn-confirm");
	  const targetName = document.querySelector("#targetName");
	
	  // Filter out bad words from the input value
	  this.value = filterBadWords(this.value, badWordsString);
	
	  // Remove any special characters and limit the input to 30 characters
	  this.value = this.value.replace(/[^a-zA-Z0-9\-* ]/g, "").substring(0, 30);
	
	  // Set the filtered name value to the target name element
	  targetName.textContent = filterBadWords(this.value, badWordsString);
	
	  // Enable or disable the confirm button based on the input value
	  if (this.value !== "") {
		btnConfirm.removeAttribute("disabled");
	  } else {
		btnConfirm.setAttribute("disabled", "");
	  }
	});



	// INPUT AMOUNT FIELD
	document.querySelector(".input-amount").addEventListener("input", function() {
	  // Handle input event on the amount field
	  const thisElement = this;
	
	  const btnConfirm = thisElement.closest(".modal-content").querySelector(".btn-confirm");
	  const targetNumber = document.querySelector("#targetNumber");
	  const targetMany = document.querySelector("#targetMany");
	
	  // Remove any non-numeric characters and leading zeros from the input value
	  this.value = this.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
	
	  // Set the numeric value to the target number element
	  targetNumber.textContent = this.value;
	
	  // Enable or disable the confirm button and update the pluralization based on the input value
	  if (this.value !== "" && this.value !== "0") {
		this.value === "1" ? targetMany.innerText = "" : targetMany.innerText = "s";
		btnConfirm.removeAttribute("disabled");
	  } else {
		targetMany.innerText = "";
		btnConfirm.setAttribute("disabled", "");
	  }
	});



	// CLEAR INPUT FIELDS
	const clearInputFields = () => {
	  // Find all input fields with the class '.input-confirm'
	  const inputFields = document.querySelectorAll('.input-confirm');
	
	  // Iterate over each input field and clear its value if it is an <input> element
	  inputFields.forEach((input) => {
		if (input.tagName === 'INPUT') {
		  input.value = '';
		}
	  });
	};



	// SET COVER IMAGE
	// Check if the video formats supported by the browser are not available
	if (!videoAnimation.canPlayType("video/mp4") && !videoAnimation.canPlayType("video/webm") && !videoAnimation.canPlayType("video/ogg")) {
	  // Create an <img> element
	  var img = document.createElement("img");
	  img.src = "assets/video/bless_cover.jpg";
	  img.alt = "Video Cover";
	  // Replace the video element with the image element
	  videoAnimation.parentNode.replaceChild(img, videoAnimation);
	}
	
	// GET SCREEN WIDTH AND HEIGHT
	const getScreenSize = () => {
	  // Retrieve the screen width and height
	  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	  var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	  return {
		width: width,
		height: height
	  };
	};



	// GET VIDEO SOURCES BASED ON SCREEN SIZE
	const getVideoSources = (screenWidth, screenHeight, blessParameter) => {
	  // Determine the parameter based on whether it's a bless or curse certificate
	  const param = blessParameter ? "bless" : "curse";
	
	  if (screenWidth < 321 || screenHeight < 321) {
		// Return video sources for screens smaller than 321x321
		return [
		  { src: `assets/video/${param}_320.mp4`, type: "video/mp4" },
		  { src: `assets/video/${param}_320.webm`, type: "video/webm" },
		  { src: `assets/video/${param}_320.ogv`, type: "video/ogg" }
		];
	  } else if (screenWidth < 361 || screenHeight < 361) {
		// Return video sources for screens smaller than 361x361
		return [
		  { src: `assets/video/${param}_360.mp4`, type: "video/mp4" },
		  { src: `assets/video/${param}_360.webm`, type: "video/webm" },
		  { src: `assets/video/${param}_360.ogv`, type: "video/ogg" }
		];
	  } else if (screenWidth < 767 || screenHeight < 767) {
		// Return video sources for screens smaller than 767x767
		return [
		  { src: `assets/video/${param}_720.mp4`, type: "video/mp4" },
		  { src: `assets/video/${param}_720.webm`, type: "video/webm" },
		  { src: `assets/video/${param}_720.ogv`, type: "video/ogg" }
		];
	  } else if (screenWidth < 991 || screenHeight < 991) {
		// Return video sources for screens smaller than 991x991
		return [
		  { src: `assets/video/${param}_960.mp4`, type: "video/mp4" },
		  { src: `assets/video/${param}_960.webm`, type: "video/webm" },
		  { src: `assets/video/${param}_960.ogv`, type: "video/ogg" }
		];
	  } else {
		// Return video sources for screens larger than or equal to 991x991
		return [
		  { src: `assets/video/${param}_1400.mp4`, type: "video/mp4" },
		  { src: `assets/video/${param}_1400.webm`, type: "video/webm" },
		  { src: `assets/video/${param}_1400.ogv`, type: "video/ogg" }
		];
	  }
	};


	
	// UPDATE VIDEO SOURCES ON SCREEN RESIZE
	const updateVideoSources = (param) => {
	  // Get the current screen size
	  var screenSize = getScreenSize();
	  var screenWidth = screenSize.width;
	  var screenHeight = screenSize.height;
	
	  // Get the updated video sources based on the screen size and parameter
	  var videoSources = getVideoSources(screenWidth, screenHeight, param);
	
	  // Remove existing video sources from the videoAnimation element
	  while (videoAnimation.firstChild) {
		videoAnimation.firstChild.remove();
	  }
	
	  // Add the updated video sources to the videoAnimation element
	  videoSources.forEach((source) => {
		var sourceElement = document.createElement("source");
		sourceElement.src = source.src;
		sourceElement.type = source.type;
		videoAnimation.appendChild(sourceElement);
	  });
	
	  // Load the updated video
	  videoAnimation.load();
	};
	
	// Call the updateVideoSources function on page load and screen resize
	window.addEventListener('load', updateVideoSources);
	window.addEventListener('resize', updateVideoSources);



	// GENERATE CERTIFICATE
	document.querySelector(".generate-cert").addEventListener("click", function() {
	  // Clear disabled href
	  clearDisabledHref();
	
	  // Define the function to be executed after capturing the certificate
	  const doSomething = () => {
		// Hide the animation modal
		document.querySelector("#BlockAnimationModal").classList.remove("show");
		document.querySelector("#BlockAnimationModal").style.display = "none";
	
		// Set the certificate image source and show the corresponding modal
		if (blessParameter) {
		  setImgSrc("BlessCertificateModal");
		  document.querySelector("#BlessCertificateModal").classList.add("show");
		  document.querySelector("#BlessCertificateModal").style.display = "block";
		} else {
		  setImgSrc("PunishCertificateModal");
		  document.querySelector("#PunishCertificateModal").classList.add("show");
		  document.querySelector("#PunishCertificateModal").style.display = "block";
		}
	
		// Clear the parameter
		clearParameter();
	  }
	
	  // Define the function to check if the certificate is ready
	  const checkIsReady = () => {
		if (!isReady) {
		  setTimeout(checkIsReady, timePause); // Check the function after a pause
		} else {
		  doSomething(); // Execute the function if isReady is true
		}
	  }
	
	  checkIsReady(); // Start the check function
	
	  // Capture the certificate based on the blessParameter and execute the doSomething function
	  if (blessParameter) {
		doCapture(".create-certificate-block.bless-cert", myCert)
		  .then(function() {
			doSomething();
		  })
		  .catch(function(error) {
			console.error(error);
		  });
	  } else {
		doCapture(".create-certificate-block.punish-cert", myCert)
		  .then(function() {
			doSomething();
		  })
		  .catch(function(error) {
			console.error(error);
		  });
	  }
	});


	
	// DO CERTIFICATE IMAGE IN FOLDER ON SERVER
	function doCapture(trigger, myDate) {
	  return new Promise(function(resolve, reject) {
		// Scroll to the top of the page
		window.scrollTo(0, 0);
	
		// Use html2canvas library to capture the content of the trigger element
		html2canvas(document.querySelector(trigger))
		  .then(function(canvas) {
			// Create an XMLHttpRequest object
			var ajax = new XMLHttpRequest();
	
			// Open a POST request to the server-side script that will handle saving the image
			ajax.open("POST", "save-capture.php?myDate=" + myDate, true, 5000);
	
			// Set the request header
			ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			console.log(canvas.toDataURL("image/jpeg", 0.75));
			// Send the captured image as a base64-encoded string to the server
			ajax.send("image=" + canvas.toDataURL("image/jpeg", 0.75));
	
			// Handle the AJAX response
			ajax.onreadystatechange = function() {
			  if (this.readyState == 4) {
				if (this.status == 200) {
				  console.log("Status ", this.responseText);
				  resolve(); // Resolve the promise if the request is successful
				} else {
				  reject(new Error("Request failed with status " + this.status)); // Reject the promise with an error if the request fails
				}
			  }
			};
		  })
		  .catch(function(error) {
			reject(error); // Reject the promise if an error occurs during capturing
		  });
	  });
	}



	// GO TO BEGIN AND REMOVE CERTIFICATE, CLEAR ALL PARAMETERS
	document.querySelector(".clear-param").addEventListener("click", function () {
	  removeCertificate(); // Removes the certificate
	  clearParameter(); // Clears all parameters
	});


	
	// PRESS ON DOWNLOAD BUTTON
	document.querySelectorAll(".download-btn").forEach((item) => {
	  item.addEventListener("click", function() {
		const thisElement = this;
		thisElement.setAttribute("href", `${siteURL}assets/certificates/${myCert}.jpg`); // Sets the href attribute of the download button to the certificate image URL
		return false;
	  });
	});



	// PRINT CERTIFICATE
	function printCertificate(url) {
	  var WinPrint = window.open('','','left=50,top=50,width=1680,height=1180,toolbar=0,scrollbars=1,status=0');
	  WinPrint.document.write('<img src="'+url+'">'); // Opens a new window and writes the certificate image to it
	  WinPrint.focus();
	  WinPrint.print(); // Prints the certificate
	}


	
	// PRESS ON PRINT BUTTON
	document.querySelectorAll(".print-btn").forEach((item) => {
	  item.addEventListener("click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		printCertificate(`${siteURL}assets/certificates/${myCert}.jpg`); // Calls the printCertificate function with the certificate image URL
	  });
	});



	// CLEAR DISABLED HREF
	// Removes the "disabled" class from elements with the class "download-btn" and "print-btn"
	const clearDisabledHref = () => {
		document.querySelectorAll(".download-btn").forEach((item) => {
			item.classList.remove("disabled");
		});
		document.querySelectorAll(".print-btn").forEach((item) => {
			item.classList.remove("disabled");
		});
	}



	// FAQ FOR SITE
	// Adds accordion functionality to FAQ items
	const faqAccordion = (item, parent) => {
	  document.querySelectorAll(item).forEach((element) => {
		element.addEventListener("click", function () {
		  const thisElement = this;
		  const parentElement = parent !== undefined ? thisElement.closest(parent) : null;
		  
		  if (!parentElement.classList.contains("active")) {
			// If the parent element doesn't have the "active" class, remove it from all other parent elements
			document.querySelectorAll(parent).forEach((el) => {
			  el.classList.remove("active");
			});
			// Add the "active" class to the clicked parent element
			parentElement.classList.add("active");
		  } else {
			// If the parent element has the "active" class, remove it
			parentElement.classList.remove("active");
		  }
		});
	  });
	};


	faqAccordion(".faq-block__title", ".faq-block__item");

});
