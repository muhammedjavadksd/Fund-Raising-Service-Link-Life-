

let fileHelper = {

    saveRequestImages: (image, path) => {
        image.mv(path, (err) => {
            if (!err) {

            }
        })
    }
}