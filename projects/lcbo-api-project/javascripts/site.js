$(document).ready(function() {
    
      let carousel = $('.carousel');
      let items = $('.carousel-item');
    
    setInterval(function() {
        let currentItem;
        let lastItem = $('.last');
    
        lastItem.removeClass('last');
          currentItem = next(lastItem);
          carousel.removeClass('reversing');
    
        currentItem.addClass('last').css('order', 1);
        for (i = 2; i <= items.length; i++) {
          currentItem = next(currentItem).css('order', i);
        }
    
        carousel.removeClass('current');
        return setTimeout(function() {
          return carousel.addClass('current');
        }, 50);
    
        function next(lastItem) {
          if (lastItem.next().length) {
            return lastItem.next();
          } else {
            return items.first();
          }
        }
      }, 3000);
    
      $(document).on('click', '.close', function() {
        $('.modal').css('display', 'none');
      })
    
      $('#submit').click(function(e) {
        e.preventDefault();
        searchFunction();
      })
    
      $(document).on('click', '.product-desc__button', function() {
        $(this.nextSibling).css('display', 'block');
      });
    
      function searchFunction() {
        $('#productData').html('<div class="loading-data"><h2>Loading results... </h2><i class="fas fa-2x fa-spinner"></i></div>');
    
        products = [];
    
        // I think I'll re-write this with async / await when I get a chance since callback hell is real
    
        let resultData = function(data) {};
        jQuery.ajax({
          url: 'https://lcboapi.com/products?q=' + $('input').val() + '/&per_page=30',
          async: true,
          headers: {
            'Authorization': 'Token MDo1YmU5YjlmNC0wZTRhLTExZTktOTQ5OS0zZjk0YTE1NTE2MmI6YzRVTEthQXFhd0JqS2ZCYXdXeHVIaTFGYWRkT0MxVGU2b01t'
          },
          success: function(data) {
            if (data.result.length == 0) {
              products.push({
                suggestion: data.suggestion
              })
            } else {
              $.each(data.result, function(i, data) {
                if (data.image_url && data.name && data.tasting_note !== null) {
                  products.push({
                    name: data.name,
                    id: data.id,
                    image: data.image_url,
                    description: data.tasting_note,
                    stores: []
                  })
                }
              })
            }
          }
        }).then(function() {
          if (products[0].suggestion) {
            $('#productData').html('<div class="loading-data"><p>Sorry, your query returned no results. Did you mean..."' + products[0].suggestion + '"?</p></div>');
          } else if (products[0].id) {
            $.each(products, function(products) {
              jQuery.ajax({
                url: 'https://lcboapi.com/stores?product_id=' + products.id,
                headers: {
                  'Authorization': 'Token MDo1YmU5YjlmNC0wZTRhLTExZTktOTQ5OS0zZjk0YTE1NTE2MmI6YzRVTEthQXFhd0JqS2ZCYXdXeHVIaTFGYWRkT0MxVGU2b01t'
                },
                success: function(data) {
                  $.each(data.result, function(i, data) {
                    products.stores.push(data.name)
                  })
                }
              })
            })
            let displayResults = (function() {
              $('#productData').html('');
              $.each(products, function(i, products) {
                let stores = products.stores;
                $('#productData').append("<div class='product-child'><img class='product-img' src=" + products.image + "><p>" + products.name + "</p><button class='product-desc__button'>Click here for details +</button><div class='modal'><div class='modal-content'><span class='close'>&times;</span><div class='modal-picture'><img width='200' src=" + products.image + "></div><div class='modal-inner'><h3>" + products.name + "</h3>" + products.description + "</div><p>" + "</p></div></div>").fadeIn(5000);
              })
            })();
          } else {
          }
        })
      }
    })