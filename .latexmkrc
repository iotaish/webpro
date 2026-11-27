$pdf_mode = 4;
$lualatex = 'lualatex -synctex=1 -interaction=nonstopmode -file-line-error %O %S';
$biber = 'biber %O --bblencoding=utf8 -u -U --output_safechars %B';
$bibtex_use = 1.5;
$max_repeat = 5;
$out_dir = 'out';
