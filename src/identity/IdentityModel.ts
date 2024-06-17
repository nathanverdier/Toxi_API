type IaResponse = {
    face_locations: Location[];
    face_names: string[];
}

type Location = {
    y1: number;
    x2: number;
    y2: number;
    x1:  number;
}