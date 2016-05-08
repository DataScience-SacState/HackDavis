    var syntaxi = {R:[
		{
		regex: /\b(if|else)\b/g,
		color: "#FF0000"
		},
		{
		regex: /\brepeat\b/g,
		color: "#FF9900"
		},
		{
		regex: /\b(while|for)\b/g,
		color: "#FFE500"
		},
		{
		regex: /\bfunction\b/g,
		color: "#CCFF00"
		},
		{
		regex: /\bin\b/g,
		color: "#33FF00"
		},
		{
		regex: /\bnext\b/g,
		color: "#00FF19"
		},
		{
		regex: /\bbreak\b/g,
		color: "#00FF66"
		},
		{
		regex: /\b(TRUE|FALSE)\b/g,
		color: "#00FFB2"
		},
		{
		regex: /\b(NULL|Inf|NaN\NA\NA_integer|NA_real|NA_complex|NA_character)\b/g,
		color: "#00B3FF"
		},
        {
        regex: /\breturn\b/g,
		color: "#FF008B"
        }
],

    JavaScript : [

	{
		regex: /\b(if|else|return)\b/g,
		color: "#FF5A55"
		},
{
		regex: /\b(\+\-|%|\/|^|&|\|)\b/g,
		color: "#D0FDD3"
		},
		{
		regex: /"(?:[^"\\\n\r]|\\.)*"/g,
		color: "#9BD066"
		},
		{
		regex: /'(?:[^'\\\n\r]|\\.)*'/g,
		color: "#9BD066"
		},
		{
		regex: /\b(var|function)\b/g,
		color: "#FFA3A1"
		},
		{
		regex: /\b(while|for|do|continue|break)\b/g,
		color: "#A5A9F2"
		},
		{
		regex: /\b(:|\?|in)\b/g,
		color: "#7D82E5"
		},
		{
		regex: /\b(true|false)\b/g,
		color: "#C247CF"
		},
		{
		regex: /\bnull\b/g,
		color: "#D76CE2"
		},
		{
		regex: /(\/\*((?!\*\/).|\n|\r)*\*\/)|(\/\/.*)/g,
		color: "#2CD236"
		}
],
    Java : [
		{
		regex: /\b(if|else|return)\b/g,
		color: "#FF5A55"
		},
        {
		regex: /\b(\+\-|%|\/|^|&)\b/g,
		color: "#D0FDD3"
		},
		{
		regex: /"(?:[^"\\\n\r]|\\.)*"/g,
		color: "#9BD066"
		},
		{
		regex: /'(?:[^'\\\n\r]|\\.)'/g,
		color: "#9BD066"
		},
		{
		regex: /\b(public|private|protected|default|static|dynamic|native|goto|void|class|enum|interface|extends|implements|import|package)\b/g,
		color: "#FFA3A1"
		},
		{
		regex: /\b(while|for|do|continue|break)\b/g,
		color: "#A5A9F2"
		},
		{
		regex: /\b(:|\?)\b/g,
		color: "#7D82E5"
		},
		{
		regex: /\b(true|false)\b/g,
		color: "#C247CF"
		},
		{
		regex: /\bnull\b/g,
		color: "#D76CE2"
		},
		{
		regex: /\b(int|long|short|boolean|byte)\b/g,
		color: "#E899F0"
		},
		{
		regex: /(\/\*((?!\*\/).|\n|\r)*\*\/)|(\/\/.*)/g,
		color: "#2CD236"
		}
    ]
  
  }




/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Compiler', 'showSidebar')
      .addToUi();
  var backGround = {};
  backGround[DocumentApp.Attribute.BACKGROUND_COLOR] = '#333333';
  DocumentApp.getActiveDocument().getBody().setAttributes(backGround);
}

function askJavaClass(){
  var ui = DocumentApp.getUi();
  var result = ui.prompt(
    "What classe's main are you running?",
    ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {
    // User clicked "OK".
    return text;
  } else if (button == ui.Button.CANCEL) {
    // User clicked "Cancel".
    return -1;
  } else if (button == ui.Button.CLOSE) {
    // User clicked X in the title bar.
    return -1;
  }
  
}
/*
function changeActiveDocument(){
  var doc = DocumentApp.getActiveDocument()
       .Att;
  var backGround = {};
  backGround[DocumentApp.Attribute.BACKGROUND_COLOR] = '#333333';
}*/

/**
 * Runs when the add-on is installed.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}


//var chosenLanguage = "Java"

function preSet() {
  if (DocumentApp.getActiveDocument().editAsText().getText().length > 0)
    DocumentApp.getActiveDocument().editAsText().setForegroundColor(0, DocumentApp.getActiveDocument().editAsText().getText().length-1, "#FFFFFF"); 
  
}

function everySecond(language){
  var language = language || "JavaScript";
  preSet();
  var text = DocumentApp.getActiveDocument().getText();
  for(var key in syntaxi){
    if(key == language){
      for(var word in syntaxi[key]){
         var re = syntaxi[key][word]["regex"]
         while((match = re.exec(text)) != null){
           DocumentApp.getActiveDocument().editAsText().setForegroundColor(match.index, re.lastIndex - 1, syntaxi[key][word]["color"]); 
         }
  
      }
    
    }
  }//*/
}


/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function showSidebar() {
  var codeAttributes = {};
  codeAttributes[DocumentApp.Attribute.BACKGROUND_COLOR] = '#34352E';
  codeAttributes[DocumentApp.Attribute.FOREGROUND_COLOR] = '#FFFFFF';
  codeAttributes[DocumentApp.Attribute.FONT_FAMILY] = 'Consolas';
  codeAttributes[DocumentApp.Attribute.MARGIN_LEFT] = 10;
  codeAttributes[DocumentApp.Attribute.MARGIN_TOP] = 10;
  codeAttributes[DocumentApp.Attribute.MARGIN_RIGHT] = 10;
  codeAttributes[DocumentApp.Attribute.MARGIN_BOTTOM] = 10;
  
  DocumentApp.getActiveDocument().getBody().setAttributes(codeAttributes);
  //patron saint of programming, guide me.
  /*var text = DocumentApp.getActiveDocument().getText();
  //DocumentApp.getActiveDocument().getBody().appendParagraph(text);
  var re = /\bfunction\b/g;
  while((match = re.exec(text)) != null){
     DocumentApp.getActiveDocument().editAsText().setForegroundColor(match.index, re.lastIndex - 1, '#FF0000'); 
  }
  //var found = text.findText('/Text/g');
  //text.setForegroundColor(found.getStartOffset(),found.getEndOffsetInclusive(), '#123456')
  */
  //everySecond("JavaScript");
  
  
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Compile')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  DocumentApp.getUi().showSidebar(ui);
}

function getDocId() {
  return DocumentApp.getActiveDocument().getId();
}

function getDocumentText() {
  return DocumentApp.getActiveDocument().getText();
}


/**
 * Gets the text the user has selected. If there is no selection,
 * this function displays an error message.
 *
 * @return {Array.<string>} The selected text.
 */
function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var text = [];
    var elements = selection.getSelectedElements();
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();

        text.push(element.getText().substring(startIndex, endIndex + 1));
      } else {
        var element = elements[i].getElement();
        // Only translate elements that can be edited as text; skip images and
        // other non-text elements.
        if (element.editAsText) {
          var elementText = element.asText().getText();
          // This check is necessary to exclude images, which return a blank
          // text element.
          if (elementText != '') {
            text.push(elementText);
          }
        }
      }
    }
    if (text.length == 0) {
      throw 'Please select some text.';
    }
    return text;
  } else {
    throw 'Please select some text.';
  }
}

/**
 * Gets the stored user preferences for the origin and destination languages,
 * if they exist.
 *
 * @return {Object} The user's origin and destination language preferences, if
 *     they exist.
 */
function getPreferences() {
  var userProperties = PropertiesService.getUserProperties();
  var languagePrefs = {
    originLang: userProperties.getProperty('originLang'),
    destLang: userProperties.getProperty('destLang')
  };
  return languagePrefs;
}

/**
 * Gets the user-selected text and translates it from the origin language to the
 * destination language. The languages are notated by their two-letter short
 * form. For example, English is 'en', and Spanish is 'es'. The origin language
 * may be specified as an empty string to indicate that Google Translate should
 * auto-detect the language.
 *
 * @param {string} origin The two-letter short form for the origin language.
 * @param {string} dest The two-letter short form for the destination language.
 * @param {boolean} savePrefs Whether to save the origin and destination
 *     language preferences.
 * @return {string} The result of the translation.
 */
function runTranslation(origin, dest, savePrefs) {
  var text = getSelectedText();
  if (savePrefs == true) {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('originLang', origin);
    userProperties.setProperty('destLang', dest);
  }

  var translated = [];
  for (var i = 0; i < text.length; i++) {
    translated.push(LanguageApp.translate(text[i], origin, dest));
  }

  return translated.join('\n');
}

/**
 * Replaces the text of the current selection with the provided text, or
 * inserts text at the current cursor location. (There will always be either
 * a selection or a cursor.) If multiple elements are selected, only inserts the
 * translated text in the first element that can contain text and removes the
 * other elements.
 *
 * @param {string} newText The text with which to replace the current selection.
 */
function insertText(newText) {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var replaced = false;
    var elements = selection.getSelectedElements();
    if (elements.length == 1 &&
        elements[0].getElement().getType() ==
        DocumentApp.ElementType.INLINE_IMAGE) {
      throw "Can't insert text into an image.";
    }
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();

        var remainingText = element.getText().substring(endIndex + 1);
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          var parent = element.getParent();
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        var element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only translate elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    var surroundingText = cursor.getSurroundingText().getText();
    var surroundingTextOffset = cursor.getSurroundingTextOffset();

    // If the cursor follows or preceds a non-space character, insert a space
    // between the character and the translation. Otherwise, just insert the
    // translation.
    if (surroundingTextOffset > 0) {
      if (surroundingText.charAt(surroundingTextOffset - 1) != ' ') {
        newText = ' ' + newText;
      }
    }
    if (surroundingTextOffset < surroundingText.length) {
      if (surroundingText.charAt(surroundingTextOffset) != ' ') {
        newText += ' ';
      }
    }
    cursor.insertText(newText);
  }
}
