// $(document).on('submit',"#loginForm",function(e){
//     e.preventDefault();
//     var email = $("#email").val();
//     var password = $("#password").val();

//     console.log(email);

//     $.ajax({
//         type: "post",
//         url: "http://localhost:4000/login",
//         dataType:"json",
//         data: {email,password},
//         success: function (response) {
//             console.log(response);            
//         }
//     });
// });

$("#loginForm").validate({
    rules:{
        email:{
            required:true,
            email:true,
            maxlength:100,
        },
        password:{
            required:true
        }
    },
    messages:{
        email:{
            required:"Please enter email address!",
            email:"Please enter email in proper format",
            maxlength:"Email cannot be greater than 100 characters",
        },
        password:{
            required:"Please enter password!"
        }
    },
    errorPlacement:function(error,element){
        // $(".asd").addClass("d-none");
        if(error.html() != '' || error.html() != undefined || error.html() != null){
            $("#"+element.attr('name')+"-error").removeClass("d-none").html('&nbsp;'+error.html());
        }
    },
    success:function(element){
        
    },
    submitHandler:function(form,e){
        e.preventDefault();
        var formData = new FormData(form);
        
        $.ajax({
            type: "post",
            url: "/login",
            data: formData,
            cache:false,
            processData:false,
            contentType:false,
            success: function (response) {
                if(response.status == true){
                    window.location.replace("/admin/dashboard");
                }         
            },
            error:function(error){
                var err = JSON.parse(error.responseText);
                $(".error-box").show();
            }
        });
    }
});

