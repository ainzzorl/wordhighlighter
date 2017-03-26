/**
 * Stemmer interface.
 * Created because I could not figure out how to use types defined in @types/natural.
 */
interface Stemmer {
    stem(token: string): string;
}
