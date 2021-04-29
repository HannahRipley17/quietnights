
var url = URL;


function getSession() {
    return fetch(url + "session", {
        credentials: "include"
    });
};

function createUser(user) {
    var userData = "fName=" + encodeURIComponent(user.fName);
    userData += "&lName=" + encodeURIComponent(user.lName);
    userData += "&email=" + encodeURIComponent(user.email);
    userData += "&plainPassword=" + encodeURIComponent(user.plainPassword);

    return fetch(url + "users", {
        method: 'POST',
        body: userData,
        credentials: "include",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
};


function loginUser(user) {
    var userData = "&email=" + encodeURIComponent(user.email);
    userData += "&plainPassword=" + encodeURIComponent(user.plainPassword);

    return fetch(url + "session", {
        method: 'POST',
        body: userData,
        credentials: "include",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
};

function logoutUser(){
    return fetch(url + "session", {
        method: 'DELETE',
        credentials: "include",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
};

function getUsers(){
    return fetch(url + "users", {
        credentials: "include"
    });
};

function deleteUser(id) {
    return fetch(url + "users/" + id, {
        method: 'DELETE',
        credentials: "include",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
};

function createFavorite(favorite) {
    var favoriteData = "title=" + encodeURIComponent(favorite.title);
    favoriteData += "&description=" + encodeURIComponent(favorite.description);
    favoriteData += "&image=" + encodeURIComponent(favorite.image);

    return fetch(url + "favorites", {
        method: 'POST',
        body: favoriteData,
        credentials: "include",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
};

function deleteFavorite(id) {
    return fetch(url + "favorites/" + id, {
        method: 'DELETE',
        credentials: "include",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
};

function putFavorite(favorite) {

    var UpdatedFavoriteData = "title=" + encodeURIComponent(favorite.title);
    UpdatedFavoriteData += "&description=" + encodeURIComponent(favorite.description);

    return fetch(url + "favorites/" + favorite.id, {
        method: 'PUT',
        body: UpdatedFavoriteData,
        credentials: "include",
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
};

function getFavorites() {
    return fetch(url + "favorites", {
        credentials: "include"
    });
};


// TODO

// super wild page for admin


var app = new Vue({
    el: '#app',
    data: {
        triangles: "img/triangles1.png",

        showLoginModal: false, // the whole login or signup thing
        showSignUpModal: false,
        showLogInModal: false,
        showMainPage: true,
        showColoringCategoryModal: false,
        showSoundsCategoryModal: false,
        showPBNCategoryModal: false,
        showIndividualItemModal: false,
        showIndividualFavoriteModal: false,
        showFavoritesSidebar: false,
        categories: [
            {
                categoryName: "Coloring Pages",
                items: [{
                    img: "img/hotairballoons.png",
                    caption: "Hot Air Balloons",
                    details: "Hot air balloons coloring page"
                },
                {
                    img: "img/mountains.jpg",
                    caption: "Mountains",
                    details: "Mountains coloring page"
                },
                {
                    img: "img/coloringcastle.jpg",
                    caption: "Castle",
                    details: "Castle coloring page"
                },
                {
                    img: "img/flowers.jpeg",
                    caption: "Flowers",
                    details: "Flowers coloring page"
                },
                {
                    img: "img/vangogh.jpg",
                    caption: "Van Gogh",
                    details: "Van Gogh coloring page"
                },
                {
                    img: "img/womancoloringpage.jpg",
                    caption: "Woman",
                    details: "Woman coloring page"
                }],
            },
            {
                categoryName: "Sounds",
                items:[{
                    img: "img/sound.png",
                    caption: "Rain",
                    details: "10 hours of ambient rain noises"
                },
                {
                    img: "img/sound.png",
                    caption: "Thunderstorm",
                    details: "3 hours of thunderstorm noises"
                },
                {
                    img: "img/sound.png",
                    caption: "Cathedral Music",
                    details: "1 hour of music sung in a cathedral"
                },
                {
                    img: "img/sound.png",
                    caption: "Birds",
                    details: "Birds chirping"
                },
                {
                    img: "img/sound.png",
                    caption: "Ocean waves",
                    details: "2 hours of ocean waves noises"
                },
                {
                    img: "img/sound.png",
                    caption: "Drums",
                    details: "5 minutes of headbanging drum sounds"
                }],
            },
            {
                categoryName: "Paint By Numbers",
                items: [{
                    img: "img/balloons.png",
                    caption: "Hot Air Balloons",
                    details: "Lots of hot air balloons!"
                },
                {
                    img: "img/waves.png",
                    caption: "Waves",
                    details: "The Great Wave off Kanagawa"
                },
                {
                    img: "img/castle.png",
                    caption: "Castle",
                    details: "Castle in green hills"
                },
                {
                    img: "img/eiffeltowermoon.png",
                    caption: "EiffelTower",
                    details: "Eiffel Tower in front of the moon"
                },
                {
                    img: "img/fallstreet.png",
                    caption: "Fall Street",
                    details: "Scene of a rainy street in the fall"
                },
                {
                    img: "img/mountain.png",
                    caption: "Mountain at sunset",
                    details: "Snowy moutain at sunset"
                }],
            },
        ],
        favorites: [],
        favoriteTitle: '',
        favoriteDesc: '',
        updatedfavoriteTitle: '',
        updatedfavoriteDesc: '',
        updatedfavoriteID: '',
        addFavoriteMode: false,
        editFavoriteMode: false,
        currentFavoriteTitle: '',
        currentFavoriteDesc: '',
        currentFavoriteID: '',
        currentFavoriteImg: '',
        currentItemCaption: '',
        currentItemDetails: '',
        currentItemImg: '',
        currentItemID: '',
        notAllFilled: false,

        registerError: null,
        registerFName: '',
        registerLName: '',
        registerEmail: '',
        registerPlainpassword: '',

        loginError: '',
        loginEmail: '',
        loginPlainpassword: '',

        isSignedIn: false,
        signinout: "Sign In",

        isAdmin: false,
        users: [],
        userIDs: [],
        readyToDisplayAdmin: false
    },

    methods: {
        registerUser: function(fName, lName, email, plainPassword) {
            if (fName == '' || lName == '' || email == '' || plainPassword == '') {
                this.registerError = "Please fill in all the fields";
            } else {
                createUser({
                    fName: fName, 
                    lName: lName,
                    email: email,
                    plainPassword: plainPassword
                }).then((response) => {
                    if (response.status == 201) {
                        this.logInUser(email, plainPassword);
                        // this.loadFavorites();
                        this.clearInputs();
                        this.signinout = "Sign Out";
                        //this.isSignedIn = true;
                        this.showLoginModal = false;
                        this.showSignUpModal = false;
                        this.showLogInModal = false;
                        this.showMainPage = true;
                        this.showCategoryModal = false;
                        this.showIndividualItemModal = false;
                        this.registerError = '';
                        this.loginError = '';
                    } else if (response.status == 422) {
                        this.registerError = "That email address is already taken"
                    }
                });
                // this.favoriteTitle = "";
                // this.favoriteDesc = "";
                // this.addFavoriteMode = false;
                // this.showIndividualItemModal = false;
    
                // this.loadFavorites();
            }

        },

        logInUser: function(email, plainPassword) {
            if (email == '' || plainPassword == '') {
                this.loginError = "Please fill in all the fields";
            } else {
                loginUser({
                    email: email,
                    plainPassword: plainPassword
                }).then((response) => {
                    if (response.status == 201) {
                        // this.loadFavorites();
                        this.clearInputs();
                        this.checkLoggedIn();
                        this.signinout = "Sign Out";
                        //this.isSignedIn = true;
                        this.showLoginModal = false;
                        this.showSignUpModal = false;
                        this.showLogInModal = false;
                        this.showMainPage = true;
                        this.showCategoryModal = false;
                        this.showIndividualItemModal = false;
                        this.showIndividualFavoriteModal = false;
                        this.registerError = '';
                        this.loginError = '';
                    } else if (response.status == 422 || response.status == 401) {
                        this.loginError = "The email or password is not correct"
                    }
                });
                // this.favoriteTitle = "";
                // this.favoriteDesc = "";
                // this.addFavoriteMode = false;
                // this.showIndividualItemModal = false;
    
                // this.loadFavorites();
            }

        },

        logOutUser: function() {
            logoutUser().then(response => {
                this.checkLoggedIn();
                this.signinout = "Sign In";
                this.showLoginModal = true;
                this.showSignUpModal = false;
                this.showLogInModal = true;
                this.showMainPage = false;
                this.showCategoryModal = false;
                this.showIndividualItemModal = false;
                this.registerError = '';
                this.loginError = '';
            });
        },

        submitFavorite: function(title, desc, img) {
            if (img == '') {
                img = "img/castle.png"
            }
            if (title=='' || desc=='') {
                this.notAllFilled = true;
            } else {
                createFavorite({
                    title: title, 
                    description: desc,
                    image: img
                }).then((response) => {
                    if (response.status == 201) {
                        this.loadFavorites();
                    } else {
                        alert("load favorites failed")
                    }
                });
                this.favoriteTitle = "";
                this.favoriteDesc = "";
                this.addFavoriteMode = false;
                this.showIndividualItemModal = false;
    
                this.loadFavorites();
            }

        },
        editFavorite: function (id) {
            if (this.updatedfavoriteTitle=='' || this.updatedfavoriteDesc=='') {
                alert("You gotta fill in all the fields");
            } else {
                putFavorite({
                    title: this.updatedfavoriteTitle, 
                    description: this.updatedfavoriteDesc,
                    id: id
                }).then((response) => {
                    if (response.status == 200) {
                        this.loadFavorites();
                    } else {
                        alert("load favorites failed")
                    }
                });
                this.updatedfavoriteTitle = "";
                this.updatedfavoriteDesc = "";
                this.editFavoriteMode = false;
                this.showIndividualFavoriteModal = false;
    
                this.loadFavorites();
            }

        },
        removeFavorite: function (id) {
            deleteFavorite(id).then((response) => {
                if (response.status == 200) {
                    this.loadFavorites();
                } else {
                    alert("load favorites failed")
                }
            });
            this.closeIndividualFavoriteModal();
            this.currentFavoriteTitle = "";
            this.currentFavoriteDesc = "";
            this.currentFavoriteID = "";
        },

        addItemToFavorites: function() {
            this.submitFavorite(this.currentItemCaption, this.currentItemDetails, this.currentItemImg);
        },

        logIn: function () {
            this.showLoginModal = false;
            this.showMainPage = true;
            this.showIndividualItemModal = false;
            this.showIndividualFavoriteModal = false;
            this.showFavoritesSidebar = false;
        },
        showLogin: function() {
            //this.isSignedIn = false;
            
        },

        adminLoggedIn: function() {
            this.isAdmin = true;
            this.showLoginModal = false;
            this.showSignUpModal = false;
            this.showLogInModal = false;
            this.showMainPage = false;
            this.showColoringCategoryModal = false;
            this.showSoundsCategoryModal = false;
            this.showPBNCategoryModal = false;
            this.showIndividualItemModal = false;
            this.showIndividualFavoriteModal = false;
            this.showFavoritesSidebar = false;

            // this.loadUsers();
            // this.loadFavorites();
            this.adminLoadUsers();
        },

        adminLoadUsers: function() {
            setTimeout(() => {
                for (let user in this.users) {
                    
                    if (this.users[user].email !== "admin") {
                        console.log(this.favorites);
                        this.users[user].favorites = [];
                        for (let favorite in this.favorites) {
                            console.log(this.favorites[favorite]);
                            if (this.favorites[favorite].user._id == this.users[user]._id) {
                                this.users[user].favorites.push(this.favorites[favorite]);
                            }
                        };
                    } else {
                        this.users.splice(user, 1);
                    }
                };
            }, 500);
        },

        openUsersDisplay: function() {
            this.readyToDisplayAdmin = true;
        },

        adminDeleteUserFavorite: function(id) {
            deleteFavorite(id).then((response) => {
                if (response.status == 200) {
                    this.loadFavorites();
                    this.loadUsers();
                } else {
                    alert("load favorites failed")
                }
            });
            this.currentFavoriteTitle = "";
            this.currentFavoriteDesc = "";
            this.currentFavoriteID = "";
        },
        adminDeleteUser: function(id) {
            let favoritesIds = [];
            for (let fav in this.favorites) {
                if (this.favorites[fav].user._id === id) {
                    favoritesIds.push(this.favorites[fav]._id);
                }
            };
            deleteUser(id).then((response) => {
                if (response.status == 200) {
                    for (let id in favoritesIds) {
                        this.deleteFavorite(favoritesIds[id]).then((response) => {
                            this.loadFavorites();
                            this.loadUsers();
                            this.adminLoadUsers();
                        });
                    }
                } else {
                    alert("remove user failed :(")
                }
            });
        },


        openCategoryModal: function(category) {
            if (category =="Coloring Pages") {
                this.showColoringCategoryModal = true;
                this.showSoundsCategoryModal = false;
                this.showPBNCategoryModal = false;
            } else if (category == "Sounds") {
                this.showColoringCategoryModal = false;
                this.showSoundsCategoryModal = true;
                this.showPBNCategoryModal = false;
            } else if (category =="Paint By Numbers") {
                this.showColoringCategoryModal = false;
                this.showSoundsCategoryModal = false;
                this.showPBNCategoryModal = true;
            }
        },
        openIndividualItemModal: function(item) {
            this.showIndividualItemModal = true;
        },
        closeCategoryModal: function() {
            this.showColoringCategoryModal = false;
            this.showSoundsCategoryModal = false;
            this.showPBNCategoryModal = false;
        },
        closeItemModal: function() {
            this.showIndividualItemModal = false;
        },

        addAnotherFavorite: function() {
            this.addFavoriteMode = true;
        },
        openEditFavorite: function() {
            this.editFavoriteMode = true;
        },

        openIndividualFavoriteModal: function() {
            this.showIndividualFavoriteModal = true;
        },
        closeIndividualFavoriteModal: function() {
            this.showIndividualFavoriteModal = false;
        },

        openFavoritesModal: function() {
            this.showFavoritesSidebar = true;
        },
        closeFavoritesModal: function() {
            this.showFavoritesSidebar = false;
        },

        setCurrentFavorite: function(title, desc, id, img) {
            this.openIndividualFavoriteModal();
            this.currentFavoriteTitle = title;
            this.currentFavoriteDesc = desc;
            this.currentFavoriteID = id;
            this.currentFavoriteImg = img;
        },
        setCurrentItem: function(caption, details, img, id) {
            this.openIndividualItemModal();
            this.currentItemCaption = caption;
            this.currentItemDetails = details;
            this.currentItemImg = img;
            this.currentItemID = id;
        },

        toggleSignup: function() {
            this.showSignUpModal = !this.showSignUpModal;
            this.showLogInModal = !this.showLogInModal;
        },

        clearInputs: function() {
            // document.querySelector("#fname").value = "";
            // document.querySelector("#lname").value = "";
            // document.querySelector("#email").value = "";
            // document.querySelector("#password").value = "";
            // document.querySelector("#loginemail").value = "";
            // document.querySelector("#loginpassword").value = "";
            // document.querySelector("#favoriteTitle").value = "";
            // document.querySelector("#favoriteDesc").value = "";
            // document.querySelector("#editFavoriteTitle").value = "";
            // document.querySelector("#editFavoriteDesc").value = "";

            this.registerFName = "";
            this.registerLName = "";
            this.registerEmail = "";
            this.registerPlainpassword = "";
            this.loginEmail = "";
            this.loginPlainpassword = "";
        },

        // print: function () {
        //     window.print();
        // },

        ImagetoPrint: function(source){
            return "<html><head><scri"+"pt>function step1(){\n" +
                    "setTimeout('step2()', 10);}\n" +
                    "function step2(){window.print();window.close()}\n" +
                    "</scri" + "pt></head><body onload='step1()'>\n" +
                    "<img src='" + source + "' /></body></html>";
        },

        print: function(source) {

            var Pagelink = "about:blank";
            var pwa = window.open(Pagelink, "_new");
            pwa.document.open();
            pwa.document.write(this.ImagetoPrint(source));
            pwa.document.close();
        },

        setTriangles: function() {
            var entry1 = document.querySelector("#fname");
            var entry2 = document.querySelector("#lname");
            var entry3 = document.querySelector("#email");
            var entry4 = document.querySelector("#password");
            var triangles = document.querySelector("#triangles");
            var signup = document.querySelector("#signup");
            
            
            entry1.oninput = function () {
                triangles.src = "img/triangles2.png";
            };
            entry2.oninput = function () {
                if (entry1.value != "") {
                    triangles.src = "img/triangles3.png";
                };
            };
            entry3.oninput = function () {
                if (entry2.value != "") {
                    triangles.src = "img/triangles4.png";
                };
            };
            entry4.oninput = function () {
                if (entry3.value != "") {
                    triangles.src = "img/triangles5.png";
                };
                signup.style.backgroundColor = "#b35db5";
                signup.style.cursor = "pointer";
            };
        },

        loadUsers: function () {
            getUsers().then((response) => {
                if(response.status == 200) {
                    response.json().then((data) => {
                        this.users = data;
                    });
                }
            });
        },


        loadFavorites: function () {
            getFavorites().then((response) => {
                if(response.status == 200) {
                    response.json().then((data) => {
                        this.favorites = data;
                    });
                }
            });
        },

        checkLoggedIn: function () {
            getSession().then(response => {
                if (response.status == 401) {
                    // not logged in
                    this.signinout = "Sign In";
                    this.isAdmin = false;
                } else if (response.status == 200) {
                    // is logged in
                    response.json().then((data) => { 
                        if (data.email == "admin") {
                            this.loadUsers();
                            this.loadFavorites();
                            this.adminLoggedIn();
                        };
                    });
                    this.isSignedIn = true;
                    this.signinout = "Sign Out";
                    this.loadFavorites();
                }
            })
        }

    },

    created: function () {
        this.checkLoggedIn();
    }

  });