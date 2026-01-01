function lerp(A, B, t) {
    return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
    /*
        Ix = Ax + (Bx - Ax)t = Cx + (Dx - Cx)u (linear interpolation for x) ...eq1
        Iy = Ay + (By - Ay)t = Cy + (Dy - Cy)u (linear interpolation for y) ...eq2

        from eq1,
        Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
        Ax + (Bx - Ax)t - Cx = (Dx - Cx)u
        (Ax - Cx) + (Bx - Ax)t = (Dx - Cx)u ...eq3

        from eq2,
        Ay + (By - Ay)t = Cy + (Dy - Cy)u
        (Ay - Cy) + (By - Ay)t = (Dy - Cy)u
        
        Multiply by (Dx - Cx) from both sides in eq2,
        (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dx - Cx)(Dy - Cy)u
        
        Replace (Dx - Cx)u from eq3 in the above eqn,
        (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy - Cy)((Ax - Cx) + (Bx - Ax)t)
        (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy - Cy)(Ax - Cx) + (Dy - Cy)(Bx - Ax)t

        rearranging,
        (Dx - Cx)(By - Ay)t - (Dy - Cy)(Bx - Ax)t = (Dy - Cy)(Ax - Cx) - (Dx - Cx)(Ay - Cy)

        taking t common,
        ((Dx - Cx)(By - Ay) - (Dy - Cy)(Bx - Ax))t = (Dy - Cy)(Ax - Cx) - (Dx - Cx)(Ay - Cy)

        t = (Dy - Cy)(Ax - Cx) - (Dx - Cx)(Ay - Cy) /     = tTop
            (Dx - Cx)(By - Ay) - (Dy - Cy)(Bx - Ax)       = bottom

        t = tTop / bottom

        similarly, if solved for u,
        uTop = (C.x - A.x)*(A.y - B.y) - (C.y - A.y)*(A.x - B.x)
        bottom = same
    */

    const tTop = (D.y - C.y) * (A.x - C.x) - (D.x - C.x) * (A.y - C.y);
    const uTop = (C.x - A.x) * (A.y - B.y) - (C.y - A.y) * (A.x - B.x);
    const bottom = (D.x - C.x) * (B.y - A.y) - (D.y - C.y) * (B.x - A.x);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) { // return only valid values in range [0, 1]
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}


function polyIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );

            if (touch) {
                return true;
            }
        }
    }

    return false;
}

function relu(x) {
    return Math.max(0, x);
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}


function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}
