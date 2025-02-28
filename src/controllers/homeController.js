let getHomePage = (req, res) => {
    return res.render('homepage.ejs');
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
let getContact = (req, res) => {
    return res.render('test/contact.ejs');
}

// object: {
//     key: '',
//     value: ''
// }
export default {
    getHomePage,
    getAboutPage,
    getContact
};
