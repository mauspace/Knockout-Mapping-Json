(function() {
  var appViewModel, getLanguages, productViewModel, shopViewModel;
  getLanguages = function(lang) {
    json = $.ajax({
      url: "js/language/" + lang + ".json",
      async: false,
      datatype: "json"
    });
    return JSON.parse(json.responseText)
  };
  appViewModel = function() {
    var appBase, appModel, json;
    appBase = {
      activelanguage: parseInt($(".active-language").val()) === 1 ? "EN" : $(".active-language").val(),
      languages: {
        ES: getLanguages("es_ES"),
        EN: getLanguages("en_US")
      },
      getNearest: "-",
      time: false
    };
    appModel = ko.mapping.fromJS(appBase);
    appModel.getTranslation = function(page, section) {
      var text;
      var currentDate = new Date()
      var day = currentDate.getDate()
      var month = currentDate.getMonth() + 1
      var year = currentDate.getFullYear()
      if (appModel.languages[appModel.activelanguage()]["site"][page][section]) {
        text = appModel.languages[appModel.activelanguage()]["site"][page][section]();
        if (page === "body" && section === "text1") {
          return text.replace("[ INSERT DATE ]", "<b>" + day + "/" + month + "/" + year + "</b>")
        }
        return text
      }
    };

    window.appModel = appModel;
    runKnockout(appModel, true)
  };

  window.runKnockout = function(appModel, bindMisc) {
    if (bindMisc == null) {
      bindMisc = false
    }

    if (bindMisc) {
      ko.applyBindings(appModel, $(".knockout-container")[0]);
      ko.applyBindings(appModel, $(".head")[0]);
    }
  };
  appViewModel()
}).call(this);
(function() {

  var checkLang, init, runLanguagebutton;

  runLanguagebutton = function() {

    $(".language-button").on("click", function() {
      var data, id, obj;
      obj = $(this);
      id = obj.find(".lang:not(.active), .langnow:not(.active)").html();
      data = {
        id: id,
        session: "activelanguage"
      };

      window.appModel.activelanguage(id);
      return checkLang()
    });
    return checkLang()
  };
  checkLang = function() {
    var lang, langnow;
    langnow = window.appModel.activelanguage();
    lang = "EN";

    if (langnow === "EN") {
      lang = "ES";
      $(".lang").removeClass("active");
      $(".langnow").addClass("active")
    } else {
      $(".langnow").removeClass("active");
      $(".lang").addClass("active")
    }
    $(".langnow").html("EN");
    return $(".lang").html("ES")
  };

  init = function() {

    runLanguagebutton();
  };
  init()
}).call(this);