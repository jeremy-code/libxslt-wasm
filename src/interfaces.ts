/**
 * `xmlEncTableEntry` is unfortunately not exported from `<libxml2/encoding.c>`.
 * Technically, `libxml2` is case-insensitive for encodings.
 *
 * @see {@link https://github.com/GNOME/libxml2/blob/master/encoding.c#L75-L113}
 */
export type Encoding = "UTF-8" | "UTF-16" | "ISO-8859-1" | "ASCII";
