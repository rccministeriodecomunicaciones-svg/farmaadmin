

exports.Admin = async (req, res) => {
    res.render('admin/admin', {
        nombrePagina: 'Farma Admin'
    })
}