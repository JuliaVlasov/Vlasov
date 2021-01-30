var documenterSearchIndex = {"docs":
[{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"EditURL = \"<unknown>/docs/examples/vlasov-poisson.jl\"","category":"page"},{"location":"examples/vlasov-poisson/#Vlasov-Poisson","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"","category":"section"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"notebook","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"We consider the dimensionless Vlasov-Poisson equation for one species with a neutralizing background.","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":" fracft+ v_x f + E(tx)  _v f = 0 \n - Δϕ = 1 - ρ E = -  ϕ \n ρ(tx)  =   f(txv) dv","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"Vlasov Equation - Wikipedia\nLandau damping - Wikipedia","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"using Plots, LinearAlgebra\npyplot()\nusing VlasovBase\nusing SplittingOperators\nusing SemiLagrangian","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"function push_t!(f, mesh1, v, n2, dt)\n    advection!(f, mesh1, v, n2, dt, BSpline(5))\nend","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"function push_v!(f, fᵗ, mesh1, mesh2, nrj, dt)\n    rho = compute_rho(mesh2, f)\n    e   = compute_e(mesh1, rho)\n    push!(nrj, 0.5*log(sum(e.*e)*mesh1.step))\n    transpose!(fᵗ, f)\n    advection!(fᵗ, mesh2, e, mesh1.length, dt, BSpline(5))\n    transpose!(f, fᵗ)\nend","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"function landau(tf, nt)\n\n  n1, n2 = 32, 64\n  x1min, x1max = 0.0, 4π\n  x2min, x2max = -6., 6.\n  mesh1 = UniformMesh(x1min, x1max, n1; endpoint=false)\n  mesh2 = UniformMesh(x2min, x2max, n2; endpoint=false)\n  x = mesh1.points\n  v = mesh2.points\n\n  ϵ, kx = 0.001, 0.5\n  f = zeros(Complex{Float64},(n1,n2))\n  f .= (1.0.+ϵ*cos.(kx*x))/sqrt(2π) * transpose(exp.(-0.5*v.^2))\n  fᵗ = zeros(Complex{Float64},(n2,n1))\n\n  dt = tf / nt\n\n  nrj = Float64[]\n\n  for it in 1:nt\n      @Strang( push_t!(f, mesh1, v, n2, dt),\n               push_v!(f, fᵗ, mesh1, mesh2, nrj, dt))\n  end\n\n  nrj\n\nend","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"nt = 500\ntf = 50.0\nt  = range(0.0, stop=tf, length=nt)\n@time nrj = landau(tf, nt)\nplot( t, nrj)\nplot!(t, -0.1533*t.-5.50)\nsavefig(\"landau-plot.png\"); nothing # hide","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"(Image: )","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"","category":"page"},{"location":"examples/vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"This page was generated using Literate.jl.","category":"page"},{"location":"contents/#Contents","page":"Contents","title":"Contents","text":"","category":"section"},{"location":"contents/","page":"Contents","title":"Contents","text":"","category":"page"},{"location":"contents/#Index","page":"Contents","title":"Index","text":"","category":"section"},{"location":"contents/","page":"Contents","title":"Contents","text":"","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"EditURL = \"<unknown>/docs/examples/vlasov-hmf.jl\"","category":"page"},{"location":"examples/vlasov-hmf/#Vlasov-HMF","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"","category":"section"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"notebook","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"using LinearAlgebra, QuadGK, Roots, FFTW\nusing VlasovBase\nusing Plots\npyplot()","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"\" Compute M₀ by solving F(m) = 0 \"\nfunction mag(β, mass)\n\n    F(m) = begin\n        g(x, n, m) = (1 / π) * (exp(β * m * cos(x)) * cos(n * x))\n        bessel0(x) = g(x, 0, m)\n        bessel1(x) = g(x, 1, m)\n        mass * quadgk(bessel1, 0, π)[1] / quadgk(bessel0, 0, π)[1] - m\n    end\n\n    find_zero(F, (0, mass))\nend","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function Norm(f::Array{Float64,2}, delta1, delta2)\n   return delta1 * sum(delta2 * sum(real(f), dims=1))\nend","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"\"\"\"\n    hmf_poisson!(fᵗ    :: Array{Complex{Float64},2},\n                 mesh1 :: UniformMesh,\n                 mesh2 :: UniformMesh,\n                 ex    :: Array{Float64})\n\n    Compute the electric hamiltonian mean field from the\n    transposed distribution function\n\n\"\"\"\nfunction hmf_poisson!(fᵗ::Array{Complex{Float64},2},\n        mesh1::UniformMesh,\n        mesh2::UniformMesh,\n        ex::Array{Float64})\n\n    n1 = mesh1.length\n    rho = mesh2.step .* vec(sum(fᵗ, dims=1))\n    kernel = zeros(Float64, n1)\n    k = π / (mesh1.stop - mesh1.start)\n    kernel[2] = k\n    ex .= real(ifft(1im * fft(rho) .* kernel * 4π ))\n\nend","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function bsl_advection!(f::Array{Complex{Float64},2},\n                        mesh1::UniformMesh,\n                        mesh2::UniformMesh,\n                        v::Array{Float64,1},\n                        dt;\n                        spline_degree=3)\n\n    fft!(f,1)\n    @simd for j in 1:mesh2.length\n        alpha = v[j] * dt\n        @inbounds f[:,j] .= interpolate(spline_degree, f[:,j], mesh1.step, alpha)\n    end\n    ifft!(f,1)\nend","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function push_v!(f, fᵗ, mesh1, mesh2, ex, dt)\n    transpose!(fᵗ, f)\n    hmf_poisson!(fᵗ, mesh1, mesh2, ex)\n    bsl_advection!(fᵗ, mesh2, mesh1, ex, dt)\n    transpose!(f, fᵗ)\nend","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function vlasov_hmf_gauss(nbiter = 10000, dt = 0.1)\n\n    mass = 1.0\n    T = 0.1\n    mesh1 = UniformMesh(-π, π, 64)\n    mesh2 = UniformMesh(-8, 8, 64)\n\n    n1, delta1 = mesh1.length, mesh1.step\n    n2, delta2 = mesh2.length, mesh2.step\n    x, v = mesh1.points, mesh2.points\n    X = repeat(x,1,n2)\n    V = repeat(v,1,n1)'\n    ϵ = 0.1\n\n    b = 1 / T\n    m = mag(b, mass)\n\n    w   = sqrt(m)\n    f   = zeros(Complex{Float64}, (n1,n2))\n    fᵗ  = zeros(Complex{Float64}, (n2,n1))\n\n    f  .= exp.(-b .* ((V.^2 / 2) - m * cos.(X)))\n    a   = mass / Norm(real(f), delta1, delta2)\n    @.  f =  a * exp(-b * (((V^2) / 2) - m * cos(X))) * (1 + ϵ * cos(X))\n\n    ex = zeros(Float64,n1)\n    hmf_poisson!(f, mesh1, mesh2, ex )\n    test = copy(f)\n    T = Float64[]\n    for n in 1:nbiter\n\n        gamma1 = Norm(real(f) .* cos.(X), delta1, delta2)\n        push!(T,gamma1)\n\n        @Strang(\n            bsl_advection!(f, mesh1, mesh2, v, dt),\n            push_v!(f, fᵗ, mesh1, mesh2, ex, dt)\n        )\n\n    end\n\n    #Substracting from gamma its long time average\n\n    Gamma1 = Norm(real(f) .*cos.(X), delta1, delta2)\n    T .= T .- Gamma1\n\n    range(0., stop=nbiter*deltat, length=nbiter), abs.(T)\n\nend","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"nbiter = 1000\ndeltat = 0.1\n@time t, T = vlasov_hmf_gauss(nbiter, deltat);\nplot(t, log.(T), xlabel = \"t\", ylabel = \"|C[f](t)-C[f][T]|\")\nsavefig(\"vlasov-hmf-plot.png\"); nothing # hide","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"(Image: png)","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"","category":"page"},{"location":"examples/vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"This page was generated using Literate.jl.","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"EditURL = \"https://github.com/JuliaVlasov/VlasovSolvers.jl/blob/master/docs/examples/vlasov-poisson.jl\"","category":"page"},{"location":"vlasov-poisson/#Vlasov-Poisson","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"","category":"section"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"notebook","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"We consider the dimensionless Vlasov-Poisson equation for one species with a neutralizing background.","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":" fracft+ v_x f + E(tx)  _v f = 0 \n - Δϕ = 1 - ρ E = -  ϕ \n ρ(tx)  =   f(txv) dv","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"Vlasov Equation - Wikipedia\nLandau damping - Wikipedia","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"using Plots, LinearAlgebra\npyplot()\nusing VlasovBase\nusing SplittingOperators\nusing SemiLagrangian","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"function push_t!(f, mesh1, v, n2, dt)\n    advection!(f, mesh1, v, n2, dt, BSpline(5))\nend","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"function push_v!(f, fᵗ, mesh1, mesh2, nrj, dt)\n    rho = compute_rho(mesh2, f)\n    e   = compute_e(mesh1, rho)\n    push!(nrj, 0.5*log(sum(e.*e)*mesh1.step))\n    transpose!(fᵗ, f)\n    advection!(fᵗ, mesh2, e, mesh1.length, dt, BSpline(5))\n    transpose!(f, fᵗ)\nend","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"function landau(tf, nt)\n\n  n1, n2 = 32, 64\n  x1min, x1max = 0.0, 4π\n  x2min, x2max = -6., 6.\n  mesh1 = UniformMesh(x1min, x1max, n1; endpoint=false)\n  mesh2 = UniformMesh(x2min, x2max, n2; endpoint=false)\n  x = mesh1.points\n  v = mesh2.points\n\n  ϵ, kx = 0.001, 0.5\n  f = zeros(Complex{Float64},(n1,n2))\n  f .= (1.0.+ϵ*cos.(kx*x))/sqrt(2π) * transpose(exp.(-0.5*v.^2))\n  fᵗ = zeros(Complex{Float64},(n2,n1))\n\n  dt = tf / nt\n\n  nrj = Float64[]\n\n  for it in 1:nt\n      @Strang( push_t!(f, mesh1, v, n2, dt),\n               push_v!(f, fᵗ, mesh1, mesh2, nrj, dt))\n  end\n\n  nrj\n\nend","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"nt = 500\ntf = 50.0\nt  = range(0.0, stop=tf, length=nt)\n@time nrj = landau(tf, nt)\nplot( t, nrj)\nplot!(t, -0.1533*t.-5.50)\nsavefig(\"landau-plot.png\"); nothing # hide","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"(Image: )","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"","category":"page"},{"location":"vlasov-poisson/","page":"Vlasov-Poisson","title":"Vlasov-Poisson","text":"This page was generated using Literate.jl.","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"EditURL = \"https://github.com/JuliaVlasov/VlasovSolvers.jl/blob/master/docs/examples/bump_on_tail.jl\"","category":"page"},{"location":"bump_on_tail/#Bump-On-Tail","page":"Bump On Tail","title":"Bump On Tail","text":"","category":"section"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"notebook","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"import VlasovBase: UniformMesh\nimport SemiLagrangian: advection!\nimport VlasovBase: compute_rho, compute_e\nimport SemiLagrangian: CubicSpline\nimport SplittingOperators: @Strang\n\nusing Plots\nusing LaTeXStrings\n\npyplot()","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"function push_t!( f, mesh1, v, dt )\n\n    advection!( f, mesh1, v, 0.5dt, CubicSpline(), 1)\n\nend\n\nfunction push_v!( f, mesh1, mesh2, nrj, dt )\n\n    rho = compute_rho(mesh2, f)\n    e   = compute_e(mesh1, rho)\n    advection!( f, mesh2, e, dt, CubicSpline(), 2)\n    push!(nrj, 0.5*log(sum(e.*e)*mesh1.step))\n\nend\n\nfunction vlasov_poisson(mesh1  :: UniformMesh,\n                        mesh2  :: UniformMesh,\n                        f      :: Array{Float64,2},\n                        nstep  :: Int64,\n                        dt     :: Float64)\n\n    x = mesh1.points\n    v = mesh2.points\n\n    nrj = Float64[]\n    for istep in 1:nstep\n\n        @Strang(  push_t!( f, mesh1, v, dt ),\n                  push_v!( f, mesh1, mesh2, nrj, dt ))\n\n\n    end\n    nrj\n\nend","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"α = 0.03\nkx  = 0.3\nx1min, x1max = 0.0, 2π / kx\nn1, n2 = 32, 64\nx2min, x2max = -9., 9.\nmesh1 = UniformMesh(x1min, x1max, n1)\nmesh2 = UniformMesh(x2min, x2max, n2)\nf = zeros(Float64,(mesh1.length,mesh2.length))\nfor (i,x) in enumerate(mesh1.points), (j,v) in enumerate(mesh2.points)\n    f[i,j]  = (1.0+α*cos(kx*x)) / (10*sqrt(2π)) * (9*exp(-0.5*v^2)+2*exp(-2*(v-4.5)^2))\nend","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"nstep = 500\nt = range(0.0, stop=50.0, length=nstep)\ndt = t[2]\n@elapsed nrj = vlasov_poisson( mesh1, mesh2, f, nstep, dt)","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"plot(t, nrj, label=L\"\\frac{1}{2} \\log(∫e²dx)\")\nsavefig(\"bot-plot.png\"); nothing # hide","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"(Image: )","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"","category":"page"},{"location":"bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"This page was generated using Literate.jl.","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"EditURL = \"https://github.com/JuliaVlasov/VlasovSolvers.jl/blob/master/docs/examples/rotation2d_bsl.jl\"","category":"page"},{"location":"rotation2d_bsl/#Rotation-of-a-gaussian-distribution","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"","category":"section"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"notebook","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"fracdfdt +  (y fracdfdx - x fracdfdy) = 0","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"import SemiLagrangian: advection!, CubicSpline\nimport VlasovBase: UniformMesh\nimport SplittingOperators: @Magic\nusing Plots\npyplot()","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"function with_bsl(tf::Float64, nt::Int)\n\n   n1, n2 = 32, 64\n   mesh1 = UniformMesh(-π, π, n1)\n   mesh2 = UniformMesh(-π, π, n2)\n   x = mesh1.points\n   y = mesh2.points\n\n   dt = tf/nt\n\n   f = zeros(Float64,(n1,n2))\n\n   for (i, xp) in enumerate(x), (j, yp) in enumerate(y)\n       xn = cos(tf)*xp - sin(tf)*yp\n       yn = sin(tf)*xp + cos(tf)*yp\n       f[i,j] = exp(-(xn-1)*(xn-1)/0.2)*exp(-(yn-1)*(yn-1)/0.2)\n   end\n\n   anim = @animate for n=1:nt\n\n\t   @Magic(advection!( f,  mesh1,  y, dt, CubicSpline(), 1),\n\t\t    advection!( f,  mesh2, -x, dt, CubicSpline(), 2)\n\t\t   )\n\n      surface(f)\n\n   end\n\n   gif(anim, \"rotanim.gif\", fps=15); nothing #hide\n\nend","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"@time f = with_bsl( 2π, 6)","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"(Image: )","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"","category":"page"},{"location":"rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"This page was generated using Literate.jl.","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"EditURL = \"<unknown>/docs/examples/rotation2d_bsl.jl\"","category":"page"},{"location":"examples/rotation2d_bsl/#Rotation-of-a-gaussian-distribution","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"","category":"section"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"notebook","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"fracdfdt +  (y fracdfdx - x fracdfdy) = 0","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"import SemiLagrangian: advection!, CubicSpline\nimport VlasovBase: UniformMesh\nimport SplittingOperators: @Magic\nusing Plots\npyplot()","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"function with_bsl(tf::Float64, nt::Int)\n\n   n1, n2 = 32, 64\n   mesh1 = UniformMesh(-π, π, n1)\n   mesh2 = UniformMesh(-π, π, n2)\n   x = mesh1.points\n   y = mesh2.points\n\n   dt = tf/nt\n\n   f = zeros(Float64,(n1,n2))\n\n   for (i, xp) in enumerate(x), (j, yp) in enumerate(y)\n       xn = cos(tf)*xp - sin(tf)*yp\n       yn = sin(tf)*xp + cos(tf)*yp\n       f[i,j] = exp(-(xn-1)*(xn-1)/0.2)*exp(-(yn-1)*(yn-1)/0.2)\n   end\n\n   anim = @animate for n=1:nt\n\n\t   @Magic(advection!( f,  mesh1,  y, dt, CubicSpline(), 1),\n\t\t    advection!( f,  mesh2, -x, dt, CubicSpline(), 2)\n\t\t   )\n\n      surface(f)\n\n   end\n\n   gif(anim, \"rotanim.gif\", fps=15); nothing #hide\n\nend","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"@time f = with_bsl( 2π, 6)","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"(Image: )","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"","category":"page"},{"location":"examples/rotation2d_bsl/","page":"Rotation of a gaussian distribution","title":"Rotation of a gaussian distribution","text":"This page was generated using Literate.jl.","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"EditURL = \"<unknown>/docs/examples/bump_on_tail.jl\"","category":"page"},{"location":"examples/bump_on_tail/#Bump-On-Tail","page":"Bump On Tail","title":"Bump On Tail","text":"","category":"section"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"notebook","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"import VlasovBase: UniformMesh\nimport SemiLagrangian: advection!\nimport VlasovBase: compute_rho, compute_e\nimport SemiLagrangian: CubicSpline\nimport SplittingOperators: @Strang\n\nusing Plots\nusing LaTeXStrings\n\npyplot()","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"function push_t!( f, mesh1, v, dt )\n\n    advection!( f, mesh1, v, 0.5dt, CubicSpline(), 1)\n\nend\n\nfunction push_v!( f, mesh1, mesh2, nrj, dt )\n\n    rho = compute_rho(mesh2, f)\n    e   = compute_e(mesh1, rho)\n    advection!( f, mesh2, e, dt, CubicSpline(), 2)\n    push!(nrj, 0.5*log(sum(e.*e)*mesh1.step))\n\nend\n\nfunction vlasov_poisson(mesh1  :: UniformMesh,\n                        mesh2  :: UniformMesh,\n                        f      :: Array{Float64,2},\n                        nstep  :: Int64,\n                        dt     :: Float64)\n\n    x = mesh1.points\n    v = mesh2.points\n\n    nrj = Float64[]\n    for istep in 1:nstep\n\n        @Strang(  push_t!( f, mesh1, v, dt ),\n                  push_v!( f, mesh1, mesh2, nrj, dt ))\n\n\n    end\n    nrj\n\nend","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"α = 0.03\nkx  = 0.3\nx1min, x1max = 0.0, 2π / kx\nn1, n2 = 32, 64\nx2min, x2max = -9., 9.\nmesh1 = UniformMesh(x1min, x1max, n1)\nmesh2 = UniformMesh(x2min, x2max, n2)\nf = zeros(Float64,(mesh1.length,mesh2.length))\nfor (i,x) in enumerate(mesh1.points), (j,v) in enumerate(mesh2.points)\n    f[i,j]  = (1.0+α*cos(kx*x)) / (10*sqrt(2π)) * (9*exp(-0.5*v^2)+2*exp(-2*(v-4.5)^2))\nend","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"nstep = 500\nt = range(0.0, stop=50.0, length=nstep)\ndt = t[2]\n@elapsed nrj = vlasov_poisson( mesh1, mesh2, f, nstep, dt)","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"plot(t, nrj, label=L\"\\frac{1}{2} \\log(∫e²dx)\")\nsavefig(\"bot-plot.png\"); nothing # hide","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"(Image: )","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"","category":"page"},{"location":"examples/bump_on_tail/","page":"Bump On Tail","title":"Bump On Tail","text":"This page was generated using Literate.jl.","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"EditURL = \"https://github.com/JuliaVlasov/VlasovSolvers.jl/blob/master/docs/examples/vlasov-ampere.jl\"","category":"page"},{"location":"vlasov-ampere/#Vlasov-Ampere","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"","category":"section"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"notebook","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"Compute Landau damping by solving Vlasov-Ampere system.","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":" fracft + υ fracfx - E(tx) fracfυ = 0","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"fracEt = - J =  fυ dυ","category":"page"},{"location":"vlasov-ampere/#Algorithm","page":"Vlasov-Ampere","title":"Algorithm","text":"","category":"section"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"For each j compute discrete Fourier transform in x of (x_iυ_j) yielding f_k^n(υ_j),\nFor k  0\nCompute f^n+1_k(υ_j) = e^2iπ k υ ΔtL f_n^k(υ_j)\nCompute ρ_k^n+1 = Δ υ _j f^n+1_k(υ_j)\nCompute E^n+1_k = ρ^n+1_k L(2iπkϵ_0)\nFor k = 0 do nothing:","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"f_n+1(υ_j) = f^n_k(υ_j) E^n+1_k = E^n_k","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"Perform in2erse discrete Fourier transform of E^n+1_k and for each j of f^n+1_k (υ_j).","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"import SemiLagrangian: advection!\nimport Fourier: Ampere\nimport SemiLagrangian: advection!,\nimport SplittingOperators: @Strang\nimport VlasovBase: compute_rho, compute_e, UniformMesh\nusing Plots, LinearAlgebra\npyplot()","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"function push_t!( f, fᵀ, mesh1, mesh2, e,  dt)\n\n    advection!( f, fᵀ, mesh1, mesh2, e,  dt, Ampere(), 1 )\n\nend","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"function push_v!(f, fᵀ, mesh1, mesh2, e, dt)\n\n    advection!( f, fᵀ, mesh1, mesh2, e, dt, Ampere(), 2)\n\nend","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"function vm1d( n1, n2, x1min, x1max, x2min, x2max , tf, nt)\n\n    mesh1 = UniformMesh(x1min, x1max, n1, endpoint=false)\n    mesh2 = UniformMesh(x2min, x2max, n2, endpoint=false)\n\n    x = mesh1.points\n    v = mesh2.points\n    ϵ, kx = 0.001, 0.5\n\n    f = zeros(Complex{Float64},(n1,n2))\n    fᵀ= zeros(Complex{Float64},(n2,n1))\n\n    f .= (1.0.+ϵ*cos.(kx*x))/sqrt(2π) .* transpose(exp.(-0.5*v.*v))\n    transpose!(fᵀ,f)\n\n    e = zeros(Complex{Float64},n1)\n\n    ρ  = compute_rho(mesh2, f)\n    e .= compute_e(mesh1, ρ)\n\n    nrj = Float64[]\n\n    dt = tf / nt\n\n    for i in 1:nt\n\n\tpush!(nrj, 0.5*log(sum(real(e).^2)*mesh1.step))\n\n        @Strang(  push_v!(f, fᵀ, mesh1, mesh2, e, dt),\n                  push_t!(f, fᵀ, mesh1, mesh2, e, dt)\n               )\n\n    end\n    nrj\nend","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"n1, n2 = 32, 64\nx1min, x1max =  0., 4π\nx2min, x2max = -6., 6.\ntf = 50\nnt = 500\n\nt = range(0,stop=tf,length=nt)\nnrj = vm1d(n1, n2, x1min, x1max, x2min, x2max, tf, nt)\nplot(t, nrj)\nplot!(t, -0.1533*t.-5.50)\nsavefig(\"va-plot.png\"); nothing","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"(Image: )","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"","category":"page"},{"location":"vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"This page was generated using Literate.jl.","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"EditURL = \"<unknown>/docs/examples/vlasov-ampere.jl\"","category":"page"},{"location":"examples/vlasov-ampere/#Vlasov-Ampere","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"","category":"section"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"notebook","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"Compute Landau damping by solving Vlasov-Ampere system.","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":" fracft + υ fracfx - E(tx) fracfυ = 0","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"fracEt = - J =  fυ dυ","category":"page"},{"location":"examples/vlasov-ampere/#Algorithm","page":"Vlasov-Ampere","title":"Algorithm","text":"","category":"section"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"For each j compute discrete Fourier transform in x of (x_iυ_j) yielding f_k^n(υ_j),\nFor k  0\nCompute f^n+1_k(υ_j) = e^2iπ k υ ΔtL f_n^k(υ_j)\nCompute ρ_k^n+1 = Δ υ _j f^n+1_k(υ_j)\nCompute E^n+1_k = ρ^n+1_k L(2iπkϵ_0)\nFor k = 0 do nothing:","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"f_n+1(υ_j) = f^n_k(υ_j) E^n+1_k = E^n_k","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"Perform in2erse discrete Fourier transform of E^n+1_k and for each j of f^n+1_k (υ_j).","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"import SemiLagrangian: advection!\nimport Fourier: Ampere\nimport SemiLagrangian: advection!,\nimport SplittingOperators: @Strang\nimport VlasovBase: compute_rho, compute_e, UniformMesh\nusing Plots, LinearAlgebra\npyplot()","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"function push_t!( f, fᵀ, mesh1, mesh2, e,  dt)\n\n    advection!( f, fᵀ, mesh1, mesh2, e,  dt, Ampere(), 1 )\n\nend","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"function push_v!(f, fᵀ, mesh1, mesh2, e, dt)\n\n    advection!( f, fᵀ, mesh1, mesh2, e, dt, Ampere(), 2)\n\nend","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"function vm1d( n1, n2, x1min, x1max, x2min, x2max , tf, nt)\n\n    mesh1 = UniformMesh(x1min, x1max, n1, endpoint=false)\n    mesh2 = UniformMesh(x2min, x2max, n2, endpoint=false)\n\n    x = mesh1.points\n    v = mesh2.points\n    ϵ, kx = 0.001, 0.5\n\n    f = zeros(Complex{Float64},(n1,n2))\n    fᵀ= zeros(Complex{Float64},(n2,n1))\n\n    f .= (1.0.+ϵ*cos.(kx*x))/sqrt(2π) .* transpose(exp.(-0.5*v.*v))\n    transpose!(fᵀ,f)\n\n    e = zeros(Complex{Float64},n1)\n\n    ρ  = compute_rho(mesh2, f)\n    e .= compute_e(mesh1, ρ)\n\n    nrj = Float64[]\n\n    dt = tf / nt\n\n    for i in 1:nt\n\n\tpush!(nrj, 0.5*log(sum(real(e).^2)*mesh1.step))\n\n        @Strang(  push_v!(f, fᵀ, mesh1, mesh2, e, dt),\n                  push_t!(f, fᵀ, mesh1, mesh2, e, dt)\n               )\n\n    end\n    nrj\nend","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"n1, n2 = 32, 64\nx1min, x1max =  0., 4π\nx2min, x2max = -6., 6.\ntf = 50\nnt = 500\n\nt = range(0,stop=tf,length=nt)\nnrj = vm1d(n1, n2, x1min, x1max, x2min, x2max, tf, nt)\nplot(t, nrj)\nplot!(t, -0.1533*t.-5.50)\nsavefig(\"va-plot.png\"); nothing","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"(Image: )","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"","category":"page"},{"location":"examples/vlasov-ampere/","page":"Vlasov-Ampere","title":"Vlasov-Ampere","text":"This page was generated using Literate.jl.","category":"page"},{"location":"#VlasovSolvers.jl-Documentation","page":"Home","title":"VlasovSolvers.jl Documentation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"First draft of a Vlasov solver.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [VlasovSolvers]\nOrder   = [:type, :function]","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"EditURL = \"https://github.com/JuliaVlasov/VlasovSolvers.jl/blob/master/docs/examples/vlasov-hmf.jl\"","category":"page"},{"location":"vlasov-hmf/#Vlasov-HMF","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"","category":"section"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"notebook","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"using LinearAlgebra, QuadGK, Roots, FFTW\nusing VlasovBase\nusing Plots\npyplot()","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"\" Compute M₀ by solving F(m) = 0 \"\nfunction mag(β, mass)\n\n    F(m) = begin\n        g(x, n, m) = (1 / π) * (exp(β * m * cos(x)) * cos(n * x))\n        bessel0(x) = g(x, 0, m)\n        bessel1(x) = g(x, 1, m)\n        mass * quadgk(bessel1, 0, π)[1] / quadgk(bessel0, 0, π)[1] - m\n    end\n\n    find_zero(F, (0, mass))\nend","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function Norm(f::Array{Float64,2}, delta1, delta2)\n   return delta1 * sum(delta2 * sum(real(f), dims=1))\nend","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"\"\"\"\n    hmf_poisson!(fᵗ    :: Array{Complex{Float64},2},\n                 mesh1 :: UniformMesh,\n                 mesh2 :: UniformMesh,\n                 ex    :: Array{Float64})\n\n    Compute the electric hamiltonian mean field from the\n    transposed distribution function\n\n\"\"\"\nfunction hmf_poisson!(fᵗ::Array{Complex{Float64},2},\n        mesh1::UniformMesh,\n        mesh2::UniformMesh,\n        ex::Array{Float64})\n\n    n1 = mesh1.length\n    rho = mesh2.step .* vec(sum(fᵗ, dims=1))\n    kernel = zeros(Float64, n1)\n    k = π / (mesh1.stop - mesh1.start)\n    kernel[2] = k\n    ex .= real(ifft(1im * fft(rho) .* kernel * 4π ))\n\nend","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function bsl_advection!(f::Array{Complex{Float64},2},\n                        mesh1::UniformMesh,\n                        mesh2::UniformMesh,\n                        v::Array{Float64,1},\n                        dt;\n                        spline_degree=3)\n\n    fft!(f,1)\n    @simd for j in 1:mesh2.length\n        alpha = v[j] * dt\n        @inbounds f[:,j] .= interpolate(spline_degree, f[:,j], mesh1.step, alpha)\n    end\n    ifft!(f,1)\nend","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function push_v!(f, fᵗ, mesh1, mesh2, ex, dt)\n    transpose!(fᵗ, f)\n    hmf_poisson!(fᵗ, mesh1, mesh2, ex)\n    bsl_advection!(fᵗ, mesh2, mesh1, ex, dt)\n    transpose!(f, fᵗ)\nend","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"function vlasov_hmf_gauss(nbiter = 10000, dt = 0.1)\n\n    mass = 1.0\n    T = 0.1\n    mesh1 = UniformMesh(-π, π, 64)\n    mesh2 = UniformMesh(-8, 8, 64)\n\n    n1, delta1 = mesh1.length, mesh1.step\n    n2, delta2 = mesh2.length, mesh2.step\n    x, v = mesh1.points, mesh2.points\n    X = repeat(x,1,n2)\n    V = repeat(v,1,n1)'\n    ϵ = 0.1\n\n    b = 1 / T\n    m = mag(b, mass)\n\n    w   = sqrt(m)\n    f   = zeros(Complex{Float64}, (n1,n2))\n    fᵗ  = zeros(Complex{Float64}, (n2,n1))\n\n    f  .= exp.(-b .* ((V.^2 / 2) - m * cos.(X)))\n    a   = mass / Norm(real(f), delta1, delta2)\n    @.  f =  a * exp(-b * (((V^2) / 2) - m * cos(X))) * (1 + ϵ * cos(X))\n\n    ex = zeros(Float64,n1)\n    hmf_poisson!(f, mesh1, mesh2, ex )\n    test = copy(f)\n    T = Float64[]\n    for n in 1:nbiter\n\n        gamma1 = Norm(real(f) .* cos.(X), delta1, delta2)\n        push!(T,gamma1)\n\n        @Strang(\n            bsl_advection!(f, mesh1, mesh2, v, dt),\n            push_v!(f, fᵗ, mesh1, mesh2, ex, dt)\n        )\n\n    end\n\n    #Substracting from gamma its long time average\n\n    Gamma1 = Norm(real(f) .*cos.(X), delta1, delta2)\n    T .= T .- Gamma1\n\n    range(0., stop=nbiter*deltat, length=nbiter), abs.(T)\n\nend","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"nbiter = 1000\ndeltat = 0.1\n@time t, T = vlasov_hmf_gauss(nbiter, deltat);\nplot(t, log.(T), xlabel = \"t\", ylabel = \"|C[f](t)-C[f][T]|\")\nsavefig(\"vlasov-hmf-plot.png\"); nothing # hide","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"(Image: png)","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"","category":"page"},{"location":"vlasov-hmf/","page":"Vlasov-HMF","title":"Vlasov-HMF","text":"This page was generated using Literate.jl.","category":"page"}]
}
