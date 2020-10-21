{

    console.log('hello');
    //method to submit the form data for new post using Ajax
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    console.log(data);
                     let newPost = newPostDom(data.data.post);
                   $('#posts-list-container').prepend(newPost);
                   deletePost($(' .delete-post-button',newPost))
                },
                error: function (error) {
                    console.log(error.responeText);
                }
            })
        })
    }

    let newPostDom = function (post) {
        return $(

            ` <div class="posts-list-container1" id="post-${post._id}">
    ${post.content}
    <small>
    ${post.user.name}
    </small>
    <small>
            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
    </small>

    <div id="comment-container">

        
            <!--if use only user throws an error because locals ia an object so it search for user key in this-->
            <form action="/comments/create" id="new-post-form" method="POST">
                    <input type="text" name="content" placeholder="type here the coment"
                            required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add comment">
            </form>

        

          
        
                    
     </div>


</div>`)
    }



let deletePost = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();
        $.ajax({
            type:'get',
            url:$(deleteLink).prop('href'),
            success:function(data)
            {
$(`#post-${data.data.post_id}`).remove();
            },
            error :function(error){
                console.log(error);
            }
        })
    })
}

    createPost();
}