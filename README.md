# formToWizard

Turn any webform into multi-step wizard with jQuery.


### Features

Every form fieldset is becoming separate "step" with forward and back buttons. It is gracefuly degrades if no script available.


### History

First, it was amazing [tutorial from Janko][1]. Unfortunately it hasn't code repository and example comes without field validation.

Second, it was inherited [tutorial from iFadey][2]. As for now, breadcrumbs is optional and plugin uses [Validation Engine][3] for step validation. It is not hosted on public repo too.

I'd like to make it neat, replace hardcoded things to callbacks and options. And drop it to github with couple of examples.  


### Sample code

To use [jQuery Validation][4] plugin and see progress as growing color bar, do something like that:

```js
var $signupForm = $( '#SignupForm' );

$signupForm.validate(); 

$signupForm.formToWizard({
    submitButton: 'SaveAccount',
    nextBtnName: 'Forward >>',
    prevBtnName: '<< Previous',

    validateBeforeNext: function(form, step) {
        var stepIsValid = true;
        var validator = form.validate();

        $(":input", step).each( function(index) {
            var x = validator.element(this);
            stepIsValid = stepIsValid && (typeof x == 'undefined' || x);
        });
        return stepIsValid;
    },

    progress: function (i, count) {
        $("#progress-complete").width(''+(i/count*100)+'%');
    }
});
 ```


### Live examples in jsfiddle

- [example 1](https://jsfiddle.net/artoodetoo/ej13317f/embedded/result/) is Junko's: progress as step list, no validation
- [example 2](https://jsfiddle.net/artoodetoo/roct3rcf/embedded/result/) is iFadey's: progress like breadcrubms, Validate Engine plugin 
- [example 3](https://jsfiddle.net/artoodetoo/r67b1jkb/embedded/result/) is mine: progress via callback as color bar, Validation plugin


[1]: http://www.jankoatwarpspeed.com/turn-any-webform-into-a-powerful-wizard-with-jquery-formtowizard-plugin/
[2]: http://www.ifadey.com/2012/06/form-to-wizard-jquery-plugin/
[3]: https://github.com/posabsolute/jQuery-Validation-Engine
[4]: http://jqueryvalidation.org/