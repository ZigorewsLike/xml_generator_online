new Vue({
    el: '#axios_post',
    data: {
        bbox: []
    },
    created: function(){
        const vm = this;
        axios.get('/api/gp/')
        .then(function (response){
            console.log(response.data)
        })
    }
})