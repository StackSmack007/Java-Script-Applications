function solve() {
  app = {
    colors: ["", "rgb(65, 63, 94)"],
    currentRow: undefined,
    handleEvent: function(evnt) {
      let selectedRow = evnt.target.parentNode;
      if (this.currentRow !== undefined && this.currentRowColor !== "") {
        this.flipColor();
      }
      if (selectedRow === this.currentRow) {
        return;
      }
      this.currentRow = selectedRow;
      this.flipColor();
    },
    get currentRowColor() {
      if (!this.currentRow) {
        return undefined;
      }
      return this.currentRow.style.backgroundColor;
    },

    flipColor: function() {
      this.currentRow.style.backgroundColor = this.colors.find(
        x => x !== this.currentRowColor
      );
    }
  };

  document
    .querySelector("table.minimalistBlack>tbody")
    .addEventListener("click", app);
}
