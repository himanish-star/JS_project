
$(function () {
    function showAll(cb) {
        $.get('categories/',{},
            (data) =>{ cb(data);});
    }

    function insertInto(categoryName,cb) {

        $.post('categories/',{

                categoryName:categoryName
            },
            (data) =>{ cb(data);});

        window.location.reload();
    }

    let categoriesList=null;
    let categoryName = $('#categoryName');
    let addCategory = $('#addCategory');
    let categoryList = $('#categoryList');
    function displayList(categories){
        let urls=categories.urlData;
        categories=categories.categoryData;
        categoriesList=categories;
        categoryList.empty();

        var i=0;

        for(let typeofcategory of categories) {
            let newCategory = $(`<div class="card float-left m-3" style="height: 15rem;">
                <button type="button" class="btn mr-4" data-toggle="modal" data-target="#myModal${i}">Add New</button>
                <h3>${typeofcategory.categoryName}</h3>
                <div class="modal fade" id="myModal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"> &times;</span>
                                </button>
                            </div>
                            
                            <div class="modal-body">
                            <h2>${typeofcategory.categoryName}</h2>
                                list of urls under this category
                               <ul id="${typeofcategory.categoryName.split(' ').join('')}">
                               </ul>

                                <form class="form">
                                    <div class="form-group">
                                        <label for="categoryName${i}"><h4 align="center">URL</h4></label><br>
                                        <input id="categoryName${i}" type="text">
                                    </div>
                                </form>

                            </div>
                            
                            <div class="modal-footer">
                                <button id='${i}' type="button" class="btn btn-primary">ADD URL TO THE LIST</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <p class="card-text" align="center"></p>
                </div>
            </div>`);

            categoryList.append(newCategory);
            document.getElementById(i).onclick=urlAppender;
            i++;
        }
        urlAppenderToModal(urls);
    }
    function urlAppenderToModal(urls) {
        for(let url of urls){
            let cname=url.categoryName.split(' ').join('');
            let element=$(`#${cname}`);
            element.append(`<li>${url.urlName}</li>`)
        }
    }
    showAll((categories)=>displayList(categories));
    function urlAppender(event){
        let ip=event.target.getAttribute('id');
        $.post('categories/urls',{
            categoryName:categoriesList[ip].categoryName,
            urlName:document.getElementById(`categoryName${ip}`).value
        });
        let url=[{
            categoryName:categoriesList[ip].categoryName,
            urlName:document.getElementById(`categoryName${ip}`).value
        }];
        urlAppenderToModal(url);
    }
    addCategory.click(()=>{
        insertInto(categoryName.val(),(categories) => showAll(categories))
    });
});