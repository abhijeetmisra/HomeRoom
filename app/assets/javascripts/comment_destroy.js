$(document).ready(function(){

  $('#delete-comment')
    .live("ajax:beforeSend", function(evt, xhr, settings){
      var $submitButton = $(this).find('input[name="commit"]');

      // Update the text of the submit button to let the user know stuff is happening.
      // But first, store the original text of the submit button, so it can be restored when the request is finished.
      $submitButton.data( 'origText', $(this).text() );
      $submitButton.text( "Submitting..." );

    })

    .live("ajax:success", function(evt, data, status, xhr){
      var $form = $(this);

      // Reset fields and any validation errors, so form can be used again, but leave hidden_field values intact.
      $form.find('textarea,input[type="text"],input[type="file"]').val("");

      // Insert response partial into page below the form.
      //$('.comments_partial').prepend(xhr.responseText);
      //$(xhr.responseText).hide().prependTo('.comments_partial').fadeIn("slow")
      //$(".comments_partial").prepend("<%= escape_javascript(render :partial => 'public/comment', :object => @comment) %>");
      //$(".comments_partial").replaceWith("a yaddy yaddy"); 

      $(this).parents(".comments_partial").replaceWith('<div class = "replaced_comments_stream">' +(xhr.responseText)+ '</div>');
      $('.replaced_comments_stream').find('span').children('a').html("&#8211").css('fontWeight', 'bold');
      //$(this).parents(".custom-comment").css("fontWeight", "bold");


    })
    .live('ajax:complete', function(evt, xhr, status){
      var $submitButton = $(this).find('input[name="commit"]');

      // Restore the original submit button text
      $submitButton.text( $(this).data('origText') );
    })
    .bind("ajax:error", function(evt, xhr, status, error){
      var $form = $(this),
          errors,
          errorText;

      try {
        // Populate errorText with the comment errors
        errors = $.parseJSON(xhr.responseText);
      } catch(err) {
        // If the responseText is not valid JSON (like if a 500 exception was thrown), populate errors with a generic error message.
        errors = {message: "Please reload the page and try again"};
      }

      // Build an unordered list from the list of errors
      errorText = "There were errors with the submission: \n<ul>";

      for ( error in errors ) {
        errorText += "<li>" + error + ': ' + errors[error] + "</li> ";
      }

      errorText += "</ul>";

      // Insert error list into form
    });

});