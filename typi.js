Vue.component('profile', {
    props: { user: {} },
    computed: {
        adressComp: function(){
            return `${this.user.address.street} ${this.user.address.suite} ${this.user.address.city} ${this.user.address.zipcode}`
        }
    },
    template: `<div><h3>{{user.name}} ({{user.username}})</h3>
                    <p>Id: n°{{user.id}}</p>
                    <ul>
                        <li>{{user.email}}</li>
                        <li>{{user.phone}}</li>
                        <li>{{user.website}}</li>
                    </ul>
                    <p>Adress: {{adressComp}} </p>
                    <p>Entreprise: {{user.company.name}} </p>
                </div>`,
})

Vue.component('to-do-list', {
    props: { userId: Number },
    data: function () {
        return {
            tasks: [],
        }
    },
    methods: {
        loadTasks: async function () {
            this.tasks = await this.$root.request(`https://jsonplaceholder.typicode.com/todos?userId=${this.userId}`);
        },
        emptyAlbPosts: function(){
            this.$root.albums=[];
            this.$root.posts=[];
        }
    },
    template: `<div v-if="userId>0"><button v-on:click="loadTasks(); emptyAlbPosts()">
    Afficher la To do list</button><ul>
    <li v-for="task of tasks" v-bind:class="[task.completed?'taskDone':'taskToDo']">{{task.title}} <input type="checkbox" v-on:change="task.completed=!task.completed" v-bind:checked="task.completed"><button>Supprimer</button></li>
    </ul></div>`,
})

Vue.component('albums', {
    props: { albumsUser: Array },
    data: function () {
        return {
            photos: [],
        }
    },
    // todo: faire un composant photos
    template: `<div><ul>
    <li v-for="album of albumsUser">{{album.title}} -- <button v-on:click="displayPhotos(album.id)">Afficher les photos</button></li> 
    </ul>
    <div class="albumFotos" v-if="photos.length>0" >
    <a v-for="photo of photos" v-bind:href="photo.url" target=_blank><p>{{photo.title}} </p><img v-bind:src="photo.thumbnailUrl">
    </a></div></div>`,
    methods: {
        displayPhotos: async function (idAlbum) {
            this.photos = await this.$root.request(`https://jsonplaceholder.typicode.com/photos?albumId=${idAlbum}`);
        }
    }
})

Vue.component('posts', {
    props: { postsUser: Array },
    data: function () {
        return {
            comments: [],
            postToDisplay: {}
        }
    },
    template: `<div>
    <ul><li v-if="postsUser.length>0" v-for="post of postsUser" v-on:click="displayComments(post.id); displayPost(post)">{{post.title}}</li></ul>
    <hr>
    <div v-show="comments.length>0"><h3>{{postToDisplay.title}}</h3><p>{{postToDisplay.body}}</p>
    <comments v-bind:comments-tab="comments"></comments>
    </div>
    </div>`,

    methods: {
        displayComments: async function (idPost) {
            this.comments = await this.$root.request(`https://jsonplaceholder.typicode.com/comments?postId=${idPost}`);
        },
        displayPost: function (post) {
            this.postToDisplay = post;
        }
    }
})

Vue.component('comments', {
    props: { commentsTab: Array },
    template: `<div><h3>Commentaires: </h3><div v-for="comment of commentsTab" class=one-comment><h4>{{comment.name}} de {{comment.email}}</h4><p>{{comment.body}}</p></div></div>`
})

let vm = new Vue({
    el: '#app',
    data: {
        listUsers: [],
        selectedId: Number,
        user: {},
        albums: [],
        posts: [],
    },
    // todo mettre url de l'api dans une data
    created: async function () {
        // recupère json list users typicode
        this.listUsers = await this.request(`https://jsonplaceholder.typicode.com/users/`);
    },
    methods: {
        updateProfile: function (id) {
            this.selectedId = id
            this.user = this.listUsers.find(user => user.id == id);
            this.albums = [];
            this.posts = [];
        },
        showAlbums: async function () {
            this.albums = await this.request(`https://jsonplaceholder.typicode.com/albums?userId=${this.user.id}`);
        },
        showPosts: async function () {
            this.posts = await this.request(`https://jsonplaceholder.typicode.com/posts?userId=${this.user.id}`);
        },
        request: async function (url) {
            let response = await fetch(url);
            let data = await response.json();
            return data;
        }
    }
})

