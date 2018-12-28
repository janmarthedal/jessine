# Chess in general

* EPD (Extended Position Description) http://portablegamenotation.com/EPD.html
* FEN (Forsyth–Edwards Notation) https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

# Chess Engines

* UCI spec. See `engine-interface.txt`
* Perft (performance test, move path enumeration) https://www.chessprogramming.org/Perft https://www.chessprogramming.org/Perft_Results

# Node Performance

* 0 instead of `EMPTY` where `const EMPTY = 0`
* `buffer[index++] = ...` instead of `buffer.set([...])`
