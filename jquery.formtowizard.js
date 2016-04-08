/*
 Form To Wizard https://github.com/artoodetoo/formToWizard
 Free to use under MIT license.

 Originally created by Janko.
 Featured by iFadey.
 Polishing by artoodetoo.

 */

(function($) {
    $.fn.formToWizard = function( options, cmdParam1 ) {
        // Stop when selector found nothing!
        if (this.length == 0) return this;

        if( typeof options !== 'string' ) {
            options = $.extend({
                submitButton:       '',
                showProgress:       true,
                showStepNo:         true,
                validateBeforeNext: null,
                select:             null,
                progress:           null,
                nextBtnName:        'Next &gt;',
                prevBtnName:        '&lt; Back',
                buttonTag:          'a',
                nextBtnClass:       'btn next',
                prevBtnClass:       'btn prev'
            }, options);
        }

        var element = this
            , steps = $( element ).find( "fieldset" )
            , count = steps.size()
            , submmitButtonName = "#" + options.submitButton
            , commands = null;


        if( typeof options !== 'string' ) {
            //assign options to current/selected form (element)
            $( element ).data( 'options', options );

            /**************** Validate Options ********************/
            if( typeof( options.validateBeforeNext ) !== "function" )
                options.validateBeforeNext = function() { return true; };

            if( options.showProgress && typeof(options.progress) !== "function") {
                if( options.showStepNo )
                    $(element).before("<ul id='steps' class='steps'></ul>");
                else
                    $(element).before("<ul id='steps' class='steps breadcrumb'></ul>");
            }
            /************** End Validate Options ******************/


            steps.each(function(i) {
                $(this).wrap('<div id="step' + i + '" class="stepDetails"></div>');
                $(this).append('<p id="step' + i + 'commands" class="commands"></p>');

                if( options.showProgress && typeof(options.progress) !== "function") {
                    if( options.showStepNo )
                        $("#steps").append("<li id='stepDesc" + i + "'>Step " + (i + 1) + "<span>" + $(this).find("legend").html() + "</span></li>");
                    else
                        $("#steps").append("<li id='stepDesc" + i + "'>" + $(this).find("legend").html() + "</li>");
                }

                if (i == 0) {
                    createNextButton(i);
                    selectStep(i);
                }
                else if (i == count - 1) {
                    $("#step" + i).hide();
                    createPrevButton(i);
                    // move submit button to the last step
                    $(submmitButtonName).addClass('next').detach().appendTo("#step" + i + "commands");
                }
                else {
                    $("#step" + i).hide();
                    createPrevButton(i);
                    createNextButton(i);
                }
            });

        } else if( typeof options === 'string' ) {
            var cmd = options;

            initCommands();

            if( typeof commands[ cmd ] === 'function' ) {
                commands[ cmd ]( cmdParam1 );
            } else {
                throw cmd + ' is invalid command!';
            }
        }


        /******************** Command Methods ********************/
        function initCommands() {
            //restore options object from form element
            options = $( element ).data( 'options' );

            commands = {
                GotoStep: function( stepNo ) {
                    var stepName = "step" + (--stepNo);

                    if( $( '#' + stepName )[ 0 ] === undefined ) {
                        throw 'Step No ' + stepNo + ' not found!';
                    }

                    if( $( '#' + stepName ).css( 'display' ) === 'none' ) {
                        $( element ).find( '.stepDetails' ).hide();
                        $( '#' + stepName ).show();
                        selectStep( stepNo );
                    }
                },
                NextStep: function() {
                    $( '.stepDetails:visible' ).find( 'a.next' ).click();
                },
                PreviousStep: function() {
                    $( '.stepDetails:visible' ).find( 'a.prev' ).click();
                }
            };
        }
        /******************** End Command Methods ********************/


        /******************** Private Methods ********************/
        function createPrevButton(i) {
            var stepName = 'step' + i;
            $('#' + stepName + 'commands').append(
                '<' + options.buttonTag + ' href="#" id="' + stepName + 'Prev" class="' + options.prevBtnClass + '">' +
                options.prevBtnName +
                '</' + options.buttonTag + '>'
            );

            $("#" + stepName + "Prev").bind("click", function(e) {
                $("#" + stepName).hide();
                $("#step" + (i - 1)).show();
                selectStep(i - 1);
                return false;
            });
        }

        function createNextButton(i) {
            var stepName = 'step' + i;
            $('#' + stepName + 'commands').append(
                '<' + options.buttonTag + ' href="#" id="' + stepName + 'Next" class="' + options.nextBtnClass + '">' +
                options.nextBtnName +
                '</' + options.buttonTag + '>');

            $("#" + stepName + "Next").bind( "click", function(e) {
                if( options.validateBeforeNext(element, $("#" + stepName)) === true ) {
                    $("#" + stepName).hide();
                    $("#step" + (i + 1)).show();
                    //if (i + 2 == count)
                    selectStep(i + 1);
                }

                return false;
            });
        }

        function selectStep(i) {
            if ( typeof(options.progress) === "function" ) {
                options.progress(i, count);
            } else if( options.showProgress ) {
                $("#steps li").removeClass("current");
                $("#stepDesc" + i).addClass("current");
            }

            if( options.select ) {
                options.select(element, $('#step'+i));
            }
        }
        /******************** End Private Methods ********************/

        return this;

    }
})(jQuery);
