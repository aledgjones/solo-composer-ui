# Known Issues

This project is very much an experimental work in progress. Things **will** break, not exist, make no sense and crash! Having said this, there are certain things to highlight that are not working as expected or are missing.

1. Music is only able to be rendered as a contiuous line. Allowing the music to flow onto new lines will be introduced once the parsing algorithm is further along.

2. Rendering may be slow and is unoptimised. This is to be expected. My focus is on the 'how' at the moment. Code performance will be concidered more thoroughly at a later date once more peices are in place.

3. Note values less than a quaver (8th note) are not yet implimented. You will see no tails or beams on these notes. This is to be expected and support for these is coming shortly.

4. Print sections do not exist at all yet. Write and engrave tabs are bassically the same. My focus is on parsing the score and rendering each component in a specific place and order. Equally, page layouts are not implimented yet for the same reason.

5. Notes can be inputted in the Play section of the app only.

6. Accidentals are not yet implimented and created tones with sharp of flats on the piano roll will always create a flat at present.

7. Short ties do not render correctly. The curve of the tie is far too steep and the possitioning is off. Equally ties between Adjacent notes just don't work as expected.

8. Many more....!
