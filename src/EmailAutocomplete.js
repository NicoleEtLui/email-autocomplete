
export default class EmailAutocomplete {
  constructor (elem, options) {
    this.$field = elem
    this.options = options

    this.suggestion = ''
    this.fieldStyle = getComputedStyle(this.$field)

    // wrapper
    const $wrap = document.createElement('div')
    $wrap.className = 'eac-input-wrap'

    $wrap.style.position = this.fieldStyle.position === 'static' ? 'relative' : this.fieldStyle.position
    $wrap.style.fontSize = this.fieldStyle.fontSize

    this.$field.parentNode.insertBefore($wrap, this.$field)
    $wrap.appendChild(this.$field)

    // Current value container: used to calculate width of content and shift suggestion
    this.$currentVal = document.createElement('span')
    this.$currentVal.className = 'eac-currentVal'

    const currentValStyles =
      "visibility:hidden;"+
      "position:absolute;"+
      "display:inline-block;"+
      "font-family:${this.fieldStyle.fontFamily};"+
      "font-weight:${this.fieldStyle.fontWeight};"+
      "letter-spacing:${this.fieldStyle.letterSpacing};"

    this.$currentVal.style = currentValStyles

    $wrap.appendChild(this.$currentVal)

    // Suggestion container
    const heightPad = parseInt(this.fieldStyle.borderTopWidth) + parseInt(this.fieldStyle.paddingTop)

    this.$suggestionOverlay = document.createElement('span')
    this.$suggestionOverlay.className = this.options.suggClass

    const suggestionOverlayStyles =
      "display:block;"+
      "box-sizing:content-box;"+
      "line-height:${this.fieldStyle.lineHeight};"+
      "padding-top:${heightPad}px;"+
      "padding-bottom:${heightPad}px;"+
      "font-family:${this.fieldStyle.fontFamily};"+
      "font-weight:${this.fieldStyle.fontWeight};"+
      "letter-spacing:${this.fieldStyle.letterSpacing};"+
      "position:absolute;"+
      "top:0;"+
      "left:0;"
    
    this.$suggestionOverlay.style = suggestionOverlayStyles
    $wrap.appendChild(this.$suggestionOverlay)

    // bind events and handlers
    this.$field.addEventListener('keyup', this.displaySuggestion)
    this.$field.addEventListener('blur', this.autocomplete)
    this.$field.addEventListener('keydown.eac', e => {
      if (e.key === 39 || e.key === 9) {
        this.autocomplete()
      }
    })

    // trouver une solution pour touchstart
    this.$suggestionOverlay.addEventListener('mousedown.eac touchstart.eac', this.autocomplete)
  }

  suggest = (str) => {
    const [, domainHint] = str.split('@')

    const match = this.options.domains.filter(function (domain) {
      return domain.indexOf(domainHint) === 0
    }).shift() || ''

    return match.replace(domainHint, '')
  }

  autocomplete = () => {
    if (typeof this.suggestion === 'undefined' || this.suggestion.length < 1) {
      return false
    }

    this.$field.value = (this.$field.value + this.suggestion)
    this.$field.dispatchEvent(new Event('change'))
    this.$suggestionOverlay.innerHTML = ''
    this.$currentVal.innerHTML = ''
    this.suggestion = ''
  }

  /**
   * Displays the suggestion, handler for field keyup event
   */
  displaySuggestion = e => {
    e.preventDefault()

    const val = this.$field.value

    this.suggestion = this.suggest(val)

    this.$suggestionOverlay.innerHTML = ''

    // update with new suggestion
    this.$suggestionOverlay.innerHTML = this.suggestion
    this.$currentVal.innerHTML = val

    // add padding, border, margin to have the offset of the text in the input field
    const fieldLeftOffset = parseInt(this.fieldStyle.borderLeftWidth) + parseInt(this.fieldStyle.paddingLeft) + parseInt(this.fieldStyle.marginLeft)

    // find width of current input val so we can offset the suggestion text
    const currentValWidth = this.$currentVal.offsetWidth

    if (this.$field.offsetWidth > currentValWidth) {
      // offset our suggestion container
      this.$suggestionOverlay.style.left = `${fieldLeftOffset + currentValWidth}px`
    }
  }
}
