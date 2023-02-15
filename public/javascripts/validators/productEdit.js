
    const fileInput = document.getElementById("image");
    fileInput.addEventListener("change", validatePhoto);

    function validatePhoto() {
        const file = fileInput.files[0];
        const fileType = file.type;
        const fileSize = file.size;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; 

        if (!allowedTypes.includes(fileType)) {
            swal("Invalid file type. Please select an image.");
            fileInput.value = "";
            return false;
        }

        if (fileSize > 5000000) {
            swal("File size is too large. Please select a file smaller than 5MB.");
            fileInput.value = "";
            return false;
        }

        return true;
    }

