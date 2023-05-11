var image = ''
var flag = 0;
function loadMime(file,callback) {
    
    //List of known mimes
    var mimes = [
        {
            mime: 'image/jpeg',
            pattern: [0xFF, 0xD8, 0xFF],
            mask: [0xFF, 0xFF, 0xFF],
        },
        {
            mime: 'image/png',
            pattern: [0x89, 0x50, 0x4E, 0x47],
            mask: [0xFF, 0xFF, 0xFF, 0xFF],
        }
        // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
    ];
    
    function check(bytes, mime) {
        for (var i = 0, l = mime.mask.length; i < l; ++i) {
            if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
                return false;
            }
        }
        return true;
    }
    
    var blob = file.slice(0, 4); //read the first 4 bytes of the file
    
    var reader = new FileReader();
    reader.onloadend = function(e) {
        if (e.target.readyState === FileReader.DONE) {
            var bytes = new Uint8Array(e.target.result);
            
            for (var i=0, l = mimes.length; i<l; ++i) {
                // if (check(bytes, mimes[i])) console.log("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
                if (check(bytes, mimes[i])){
                    flag = 1;
                    return callback(flag);
                };
            }
            flag = 2;
            return callback(flag);
        }
    };
    reader.readAsArrayBuffer(blob);
}

function load_preview_image(input) {
    
    if (input.files && input.files[0]) {
        loadMime(input.files[0],function(myFlag){
        
        });
        
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#preview_div").css('display','block');
            $('#image_preview').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#preview_div").hide();
    }
    
    const file = input.files[0];
    const FR = new FileReader();
    FR.addEventListener("load", function(evt) {
        FR.result;
    });     
    FR.readAsDataURL(input.files[0]);
    image = FR;
    console.log(image.result,'BASE64');
}

$("#profile_frm").validate({
    rules:{
        name:{
            required:true,
            pattern:/\D+/,
            minlength:3,
            maxlength:60,
            
        },
        // last_name:{
        //     required:true,
        //     pattern:/\D+/,
        //     maxlength:60,
        // },
        email:{
            required:true,
            email:true,
            maxlength:100,
            // remote:{
            //     url:"/admin/users/check-duplicate-email",
            //     type:"post",
            //     data:{
            //         id:function(){
            //             return $("#id").val();
            //         }
            //     }
            // }
        },
        password_confirmation:{
            required:{
                depends:function(){
                    // console.log($("#password").val(),++cnt);
                    if($("#password").val() == undefined || $("#id").val() == null || $("#id").val() == ""){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            },
            equalTo:"#password"
            
        },
        image:{
            extension:'jpg|jpeg|png|gif'
        }
    },
    messages:{
        name:{
            required:"Please Enter First Name!",
            minlength:"Atleast 3 Characters are required!",
            maxlength:"First name cannot be greater than 60 characters!",
            pattern:"First name should have alphabets and spaces only!"
        },
        // last_name:{
        //     required:"Please Enter Last Name!",
        //     minlength:"Atleast 3 Characters are required!",
        //     maxlength:"Last name cannot be greater than 60 characters!",
        //     pattern:"Last name should have alphabets and spaces only!"
        // },
        email:{
            required:"Please enter email!",
            email:"Please enter email in proper format",
            maxlength:"Email cannot exceed more than 100 characters!",
            // remote:"Email already exists!"
        },
        password_confirmation:{
            required:"Please Enter Confirm Password!",
            equalTo:"Confirm Password Should Match Password!"
            
        },
        image:{
            extension:"Only jpg,jpeg,png,gif formats are supported!"
        }
    },
    errorPlacement:function(error,element){
        $("#"+element.attr('name')+"-error").html('&nbsp;'+error.html());
    },
    success:function(label){
        
    },
    submitHandler:function(form,e){
        e.preventDefault();
        var formData = new FormData(form);
        if(image != ''){
            formData.append('image',image.result);
        }
        if(flag != 2){
            $.ajax({
                type: "post",
                url: "/admin/profile",
                data:formData,
                cache:false,
                processData:false,
                contentType:false,
                beforeSend: function(){
                    $('.load-gif').show();
                }, 
                success: function (response) {
                    if(response.status == true){
                        toastr.success(response.message,"Updated!") 
                        $('.load-gif').hide();                           
                    }else{
                        $('.load-gif').hide();
                        toastr.error(response.message,"Error!")
                    }              
                },
                error:function(error){
                    var err = JSON.parse(error.responseText)
                    $('.load-gif').hide();
                    toastr.error(err.error,"Error!")
                }
            });
        }else{
            toastr.error("In-valid file","Error!");
        }
    }
})