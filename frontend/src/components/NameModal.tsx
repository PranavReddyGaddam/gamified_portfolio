import DetailModal from "./DetailModal";

type Props = {
  closing: boolean;
  onClose: () => void;
};

/**
 * What the name means.
 *
 * The hero mark is ॐ rather than a monogram because the name and the symbol
 * are the same thing: praṇava is one of the traditional names of Om. This
 * panel is the footnote for anyone who clicks the mark wondering why.
 */
const NameModal = ({ closing, onClose }: Props) => (
  <DetailModal crumb="Name" title="Pranav" closing={closing} onClose={onClose}>
    <h1 className="pm-title">Pranav</h1>

    <dl className="pm-meta">
      <div>
        <dt>Telugu</dt>
        <dd lang="te">ప్రణవ్</dd>
      </div>
      <div>
        <dt>Sanskrit</dt>
        <dd>praṇava</dd>
      </div>
      <div>
        <dt>Symbol</dt>
        <dd lang="sa" className="om-glyph">ॐ</dd>
      </div>
    </dl>

    <p className="pm-lede">
      Praṇava is one of the traditional names for{" "}
      <span lang="sa" className="om-glyph">ॐ</span>. The name and the symbol
      are the same thing, which is why the mark above is not a monogram.
    </p>

    <p className="pm-para">
      In the Sanskrit grammatical tradition the word is read as the sound that
      precedes everything else, the syllable from which the rest follows. It
      is where the Telugu phrase oṃkāra nādaṃ comes from: oṃkāra being the
      syllable itself, nādaṃ the sound or vibration of it.
    </p>

    <p className="pm-para">
      So the mark in the corner is not decoration borrowed from somewhere. It
      is the literal meaning of the word my parents chose, drawn as the thing
      it names.
    </p>
  </DetailModal>
);

export default NameModal;
