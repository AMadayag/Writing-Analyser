export class SentenceStart {
  constructor(
    POVName, // "Glinda stood"
    char, // "Elphaba stood"
    pronoun, // "She stood"
    expletive, // "It was/there was"
    preposition, // "On that day"
    other
  ) {
    this.POVName = POVName;
    this.char = char;
    this.pronoun = pronoun
    this.expletive = expletive;
    this.preposition = preposition;
    this.other = other;
  }
}
