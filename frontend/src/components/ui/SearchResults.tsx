import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

/*
city: "Lublin"
​​​
course: "matematyka"
​​​
experience: "ogółem"
​​​
faculty: ""
​​​
graduatesNumber: 18
​​​
graduationYear: 2021
​​​
institution: "politechnika lubelska"
​​​
institutionKind: "Uczelnia publiczna"
​​​
name: "Matematyka"
​​​​​
*/

interface SearchResult {
  city: string;
  name: string;
  course: string;
  graduatesNumber: string;
  graduationYear: string;
  przedmiot: string;
  institution: string;
  score: string;
  timeOfLookingForJob: string;
  totalSalary: string;
  unemployedRisk: string;
  voivodeship: string;
}
export interface SearchResultsProps {
  results: SearchResult[];
}

const SearchWidget = ({
  city,
  name,
  course,
  graduatesNumber,
  graduationYear,
  przedmiot,
  score,
  timeOfLookingForJob,
  totalSalary,
  unemployedRisk,
  voivodeship,
  institution,
}: SearchResult) => {
  return (
    <Card className="w-full my-6">
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{institution}</CardDescription>
          </div>
          <div className="flex flex-row items-center justify-between space-y-1.5">
            <div className="mx-4">
              Total salary:
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                {totalSalary}
              </h2>
            </div>
            <Button>
              <Link className="mr-2 h-4 w-4" /> Strona kierunku
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wynik Bezrobocia
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unemployedRisk}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Czas szukania pierwszej pracy
              </CardTitle>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeOfLookingForJob}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Liczba absolwentów
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{graduatesNumber}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Liczba osób na jedno miejsce
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number(score).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-sm font-medium">Słowa pasujące</CardTitle>
          <CardDescription>{}</CardDescription>
        </div>
      </CardFooter>
    </Card>
  );
};

const SearchResults = ({ results }: SearchResultsProps) => {
  console.log(results);

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Wyniki wyszukiwania
      </h1>
      {results.map((result) => (
        <SearchWidget {...result} />
      ))}
    </div>
  );
};

export default SearchResults;
