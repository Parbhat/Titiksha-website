/**
 * Define Functions 
 *
 * @author Akshay Pratap Singh <pratapakshay0@gmail.com>
 */

//Create a boolean variable to check for a valid IE instance.
var xmlhttp = false;

//Check if we are using IE.
try {
	//If the javascript version is greater than 5.
	xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
} catch (e) {

	//If not, then use the older active x object.
	try {
		//If we are using IE.
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} catch (E) {
		//Else we must be using a non-IE browser.
		xmlhttp = false;
	}
}

//If we are using a non-IE browser, create a JavaScript instance of the object.
if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
	xmlhttp = new XMLHttpRequest();
}

/*************  Password Strength variables ************************/
var strPassword;  
var charPassword;  
var complexity = $("#complexity");  
var minPasswordLength = 8;  
var baseScore = 0, score = 0;  
  
var num = {};  
num.Excess = 0;  
num.Upper = 0;  
num.Numbers = 0;  
num.Symbols = 0;  
  
var bonus = {};  
bonus.Excess = 3;  
bonus.Upper = 4;  
bonus.Numbers = 5;  
bonus.Symbols = 5;  
bonus.Combo = 0;   
bonus.FlatLower = 0;  
bonus.FlatNumber = 0;  

/*******************************************************************/
function  checkEmail(){
	var x=document.forms["reg_form"]["email"].value;
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
	if( !(x.match(mailformat)) )
    {
   		$('#email_warning').css("display","block").html("* Not a valid e-mail address");
    	return false;
    }else{
    	$('#email_warning').css("display","none").html("");
    	return true;
    }
}
function checkEmailRegistered() {

    var email=document.forms["reg_form"]["email"].value;
    var serverPage= "php/emailRegistered.php?email="+email;
    xmlhttp.open("GET", serverPage);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
           if(new String(xmlhttp.responseText)=="true"){
                resetFields();
                var warningMessage="* Email-id is already registered.";
                $(".msg-Box").addClass("md-show warning").css("display","block");
                $(".msg-Box > .msg-content").html(warningMessage);
                $(".msg-Box > .msg-close").css("display","block");
           }
                
        }
    }
    xmlhttp.send(null);
}
function validateForm(){
	var name=document.forms["reg_form"]["name"].value;
	if(name==null || name=="")
		return 0;

	var email=document.forms["reg_form"]["email"].value;
	if(email==null || email=="")
		return 0;

	var college=document.forms["reg_form"]["college"].value;
	if(college==null || college=="")
		return 0;

	var contact=document.forms["reg_form"]["contact"].value;
	if(contact==null || contact=="")
		return 0;

	var password=document.forms["reg_form"]["password"].value;
	if(password==null || password=="")
		return 0;

	var repassword=document.forms["reg_form"]["repassword"].value;
	if(repassword==null || repassword=="")
		return 0;
	
	return 1;
}


function sendFormDetails() {
	var name=document.forms["reg_form"]["name"].value;
	var email=document.forms["reg_form"]["email"].value;
	var college=document.forms["reg_form"]["college"].value;
	var year=document.forms["reg_form"]["year"].value;
	var contact=document.forms["reg_form"]["contact"].value;
	var gender=$("#reg_form input[type='radio']:checked").val();;
	var password=document.forms["reg_form"]["password"].value;

	var serverPage= "php/registerUser.php?name="+name+"&email="+email+"&college="+college+"&year="+year+"&contact="+contact+"&gender="+gender+"&password="+password;
	xmlhttp.open("GET", serverPage);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			resetFields();
			var confirmMessage="You have been successfully registered !.<br> An email has been sent on your registered email-id.";
            $(".msg-Box").addClass("md-show confirmation").css("display","block");
            $(".msg-Box > .msg-content").html(confirmMessage);
            $(".msg-Box > .msg-close").css("display","block");
		}
	}
	xmlhttp.send(null);
}

function resetFields() {
	$("#form input").val("");
    $("#complexity").css("display","none");
    $('#reg_form input[value="Male"]').attr("checked");
    $('#reg_form option[name="1st"]').attr("selected");
}

function checkPasswordStrength()  
{  
	init();

    if (charPassword.length >= minPasswordLength)  
    {  
        baseScore = 50;   
        analyzeString();      
        calcComplexity();         
    }  
    else  
    {  
        baseScore = 0;  
    }  
      
    outputResult();  
}  
function init()  
{  
    strPassword= $("#reg_form input[name='password']").val();  
    charPassword = strPassword.split("");  
          
    num.Excess = 0;  
    num.Upper = 0;  
    num.Numbers = 0;  
    num.Symbols = 0;  
    bonus.Combo = 0;   
    bonus.FlatLower = 0;  
    bonus.FlatNumber = 0;  
    baseScore = 0;  
    score =0;  
}  
function analyzeString ()  
{     
    for (i=0; i<charPassword.length;i++)  
    {  
        if (charPassword[i].match(/[A-Z]/g)) {num.Upper++;}  
        if (charPassword[i].match(/[0-9]/g)) {num.Numbers++;}  
        if (charPassword[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) {num.Symbols++;}   
    }  
      
    num.Excess = charPassword.length - minPasswordLength;  
      
    if (num.Upper && num.Numbers && num.Symbols)  
    {  
        bonus.Combo = 25;   
    }  
  
    else if ((num.Upper && num.Numbers) || (num.Upper && num.Symbols) || (num.Numbers && num.Symbols))  
    {  
        bonus.Combo = 15;   
    }  
      
    if (strPassword.match(/^[\sa-z]+$/))  
    {   
        bonus.FlatLower = -15;  
    }  
      
    if (strPassword.match(/^[\s0-9]+$/))  
    {   
        bonus.FlatNumber = -35;  
    }  
}  

function calcComplexity()  
{  
    score = baseScore + (num.Excess*bonus.Excess) + (num.Upper*bonus.Upper) + (num.Numbers*bonus.Numbers) +   
(num.Symbols*bonus.Symbols) + bonus.Combo + bonus.FlatLower + bonus.FlatNumber;   
}  

function outputResult()  
{  
    if ($("#reg_form input[name='password']").val()== "")  
    {   
        complexity.html("Please enter password").addClass("default");  
    }  
    else if (charPassword.length < minPasswordLength)  
    {  
        complexity.html("At least " + minPasswordLength+ " characters please!").addClass("weak");  
    }  
    else if (score<50)  
    {  
        complexity.html("Weak!").addClass("weak");  
    }  
    else if (score>=50 && score<75)  
    {  
        complexity.html("Average!").addClass("strong");  
    }  
    else if (score>=75 && score<100)  
    {  
        complexity.html("Strong!").addClass("stronger");  
    }  
    else if (score>=100)  
    {  
        complexity.html("Secure!").addClass("strongest");  
    }  
} 

function matchPassword() {
    var pass1=$("#reg_form input[name='password']").val();
    var pass2=$("#reg_form input[name='repassword']").val();
    if(pass1==pass2){
        $("#password_warning").css("display","none").html("");
    }else{
        $("#password_warning").css("display","block").html("* Password don't match");
    }
 } 