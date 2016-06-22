
import * as $ from "jquery";


interface Point {
    x: number;
    y: number;
}

interface Segmet {
    a: Point;
    b: Point;
}

enum Sides {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}

function getCorner(rect: ClientRect, side: Sides): Segmet {
    switch (side) {
        case Sides.TOP: {
            return {
                a: {
                    x: rect.left,
                    y: rect.top
                },
                b: {
                    x: rect.right,
                    y: rect.top
                }
            }
        }

        case Sides.BOTTOM: {
            return {
                a: {
                    x: rect.bottom,
                    y: rect.left
                },
                b: {
                    x: rect.bottom,
                    y: rect.right
                }
            }
        }

        case Sides.LEFT: {
            return {
                a: {
                    x: rect.top,
                    y: rect.left
                },
                b: {
                    x: rect.bottom,
                    y: rect.left
                }
            }
        }

        case Sides.LEFT: {
            return {
                a: {
                    x: rect.top,
                    y: rect.right
                },
                b: {
                    x: rect.bottom,
                    y: rect.right
                }
            }
        }

        default: {
            return null;
        }
    }


}

function getLineIntersection(/* p0_x: number,  p0_y: number,  p1_x: number,  p1_y: number, */
    a: Segmet,
    b: Segmet

     /*p2_x: number,  p2_y: number,  p3_x: number,  p3_y: number):Point */) {
    let s1_x, s1_y, s2_x, s2_y;
    s1_x = a.b.x - a.a.x; s1_y = a.b.y - a.a.y;
    s2_x = b.b.x - b.a.x; s2_y = b.b.y - b.a.y;

    let s, t;
    s = (-s1_y * (a.a.x - b.a.x) + s1_x * (a.a.y - b.a.y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = (s2_x * (a.a.y - b.a.y) - s2_y * (a.a.x - b.a.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        // Collision detected

        return {
            x: a.a.x + (t * s1_x),
            y: a.a.y + (t * s1_y)
        };
    }

    return null; // No collision
}

function getCenter(rect: ClientRect): Point {
    return {
        y: (rect.left + rect.right) / 2,
        x: (rect.top + rect.bottom) / 2
    };
}

function lineIntersection(a: Segmet, b: Segmet): Point {

    let intersection_point: Point = getLineIntersection(a, b);

    if (intersection_point) {
        return intersection_point;
    }


    return null;
}



function findDistance(rect_a: ClientRect, rect_b: ClientRect): number {
    //найдем отрезок между центрами
    let cross: Segmet = {
        a: getCenter(rect_a),
        b: getCenter(rect_b)
    };

    lineIntersection(cross, getCorner(rect_b, Sides.TOP));

    return 0;
}

var svg = Snap("#svg");


var a = svg.rect(0, 0, 50, 100);
a.attr({ fill: 'red' });

var b = svg.rect(0, 100, 100, 50);
b.attr({ fill: 'green' });

a.drag();
b.drag();

var line = null;
var line_2 = null;
var temp_rect = null;


function bbToCR(box: Snap.BBox): ClientRect {
    return {
        bottom: box.x2,
        height: box.height,
        left: box.y,
        right: box.y2,
        top: box.x,
        width: box.width,
    };
}

var handler = function () {

    let a_rect = bbToCR(a.getBBox());
    let b_rect = bbToCR(b.getBBox());

    let cross: Segmet = {
        a: getCenter(a_rect),
        b: getCenter(b_rect)
    };

    if (!line) {
        line = svg.paper.line(cross.a.x, cross.a.y, cross.b.x, cross.b.y);
        line.attr({ stroke: "magenta" });
    } else {
        line.attr({
            x1: cross.a.x,
            y1: cross.a.y,
            x2: cross.b.x,
            y2: cross.b.y,
        })
    }

let ln  = getCorner(b_rect, Sides.TOP);

    if (!line_2) {
        line_2 = svg.paper.line(ln.a.x, ln.a.y, ln.b.x, ln.b.y);
        line_2.attr({ stroke: "black" });
    } else {
        line_2.attr({
            x1: ln.a.x,
            y1: ln.a.y,
            x2: ln.b.x,
            y2: ln.b.y,
        })
    }



    // let point = lineIntersection(cross, getCorner(b_rect, Sides.TOP));

    // if(temp_rect) {temp_rect.remove();}
    // if(point) {


    //     temp_rect = svg.rect(point.x - 2, point.y - 2, 4, 4);
    // }
}

eve.on("snap.drag.move." + a.id, handler);

eve.on("snap.drag.move." + b.id, handler);
