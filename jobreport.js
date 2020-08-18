$(function(){
	
	// variable of the list on Show Log page and Get Log page
	const ul = document.getElementById("showContent");
	const ulGet = document.getElementById("getContent");
	// function to maintain the logs on Showlog page
	showLogs();
	// functio to maintain the logs on Getlog page
	showGetPage();

	//Clear button on 2nd page to clear form
	$("#clear-btn").tap(function(){
		$("#myForm")[0].reset();
	});

	$("#delete").tap(function(){
		localStorage.clear();
		location.reload();
	});

	//Save button to save job report to localstorage
	$("#save-btn").tap(function(){
		var name = $("#name").val();
		var jobtype = $("#category").val();
		var product = $("#product").val();
		var quantity = $("#quantity").val();
		var sold = $("#sold").val();
		var latitude;
		var longitude;
		var time = new Date().toLocaleString();
		var recordList = localStorage.getItem('report') ? JSON.parse(localStorage.getItem('report')) : [];

		if (name==''||jobtype==''||sold==''||quantity==''||product==''){
			alert("All field must be filled");
		} else
		if (sold<0||quantity<0){
			alert("Quantity must be more than 0");
		} else
		if (sold>quantity){
			alert("Sold quantity must be smaller than original quantity");
		} else {
			//Get location of the device
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					latitude = +position.coords.latitude;
					longitude = +position.coords.longitude;
					record();
				},()=>{
					alert("Sorry, no position available.");
					record();
				});
			} else {
				latitude = "N/A";
				longitude = "N/A";
			}
			function record(){
				var record = {
					name:`${name}`,
					time:`${time}`,
					latitude:`${latitude}`,
					longitude:`${longitude}`,
					jobtype:`${jobtype}`,
					product:`${product}`,
					quantity:`${quantity}`,
					sold:`${sold}`,
				};
				recordList.push(record);
				localStorage.setItem('report',JSON.stringify(recordList));
				alert("Log saved.");
				$("#myForm")[0].reset();
			}
		}
	});

	//Show button on 2nd page, trigger get location and time, then add data into saved logs
	$("#show-btn").tap(function(){
		clearShowLog();
		showLogs();
		$.mobile.changePage("#show-log-page");		
	});

	

	//Function to keep logs maintained after refreshing page
	function showLogs(){
		var data = JSON.parse(localStorage.getItem('report'));
		if (data != null){
			for (var i=0;i<data.length;i++){
				var dataShow = `${data[i].time}, ${data[i].latitude}, ${data[i].longitude}, ${data[i].name}, ${data[i].jobtype}, ${data[i].product}, ${data[i].quantity}, ${data[i].sold}`;
				liMaker(dataShow);
			}
		} else {
			liMaker("There is no report yet");
		}
	}

	//Function to clear the Show Log Page to avoid duplicate data
	function clearShowLog(){
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
		while (ulGet.firstChild){
			ulGet.removeChild(ulGet.firstChild);
		}
	}

	//Function to create new item in the List in show log page
	function liMaker(text){
		var li = document.createElement("li");
		li.setAttribute("class","wrap");
		li.textContent=text;
		ul.appendChild(li);
		$("#showContent").listview().listview("refresh");
	}

	//Send button to clear the localstorage
	$("#send-btn").tap(function(){
		var data = JSON.parse(localStorage.getItem('report'));
		if (confirm("Do you want to send your report? This has the effect of deleting all logs.")) {
			if (data!=null){
				var uri = 'http://localhost:3000/send';
				var res1 = encodeURI(uri);
				$.ajax({
					url:res1,
					type:'POST',
					dataType:'text',
					data:{data:JSON.stringify(data)},
					success:(data)=>{
						alert('Log was sent');
						localStorage.removeItem('report');
						$.mobile.changePage("#Item");
						alert('Success');
					},
					error:(e)=>alert(JSON.stringify(e))
				});
			} else alert('There is report to be sent.');
		}
	});

	//GET button function triggered. The app connect mongodb to retrieve data
	$('#get-btn').tap(function(){
		var uri = `http://localhost:3000/get-data`;
		var res1 = encodeURI(uri);
		$.ajax({
			url:res1,
			dataType :'text',
			type:'GET',
			success:(result)=>{
				localStorage.setItem('getResult',result);
				clearShowLog();
				showGetPage();
				$.mobile.changePage("#get-log-page");
			},
			error:(e)=>alert(JSON.stringify(e))
		});
	});

	//Show retrieved data on GET page
	function showGetPage(){
		var data = JSON.parse(localStorage.getItem("getResult"));
		if (data!=null){
			if (data.length!=0){
				for (var i=0;i<data.length;i++){
					var dataShow = `${data[i].time}, ${data[i].latitude}, ${data[i].longitude}, ${data[i].name}, ${data[i].jobtype}, ${data[i].product}, ${data[i].quantity}, ${data[i].sold}`;
					liMakerGet(dataShow);
				}
			} else {
				liMakerGet("There is no report from the server");
			}
		}
		
	}

	//BACK button on the GET page
	$("#back-btn").tap(function(){
		clearShowLog();
		showLogs();
		$.mobile.changePage("#show-log-page");		
	});

	//function to create list on GET page
	function liMakerGet(text){
		var li = document.createElement("li");
		li.setAttribute("class","wrap");
		li.textContent=text;
		ulGet.appendChild(li);
		$("#getContent").listview().listview("refresh");
	};

});