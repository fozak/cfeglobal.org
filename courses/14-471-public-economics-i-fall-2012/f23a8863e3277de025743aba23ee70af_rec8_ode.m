% this is an example of how to simulate a simple ODE system using Matlab.
% Based on: Matt Rognlie's recitation material 14.451

%% Problem description

% We want to find the solution y(x) to a 2-dimensional ODE system of the form
% y_1'(x) = alpha*y_1(x)*y_2(x) + beta*x
% y_2'(x) = y_1(x)^2 + y_2(x)^2 - x
% over the interval [0,T] of x, with initial condition y_1(0) = y_2(0) = 1

%% Specify parameters
% (These are totally arbitrary)
alpha = 0.5;
beta = 0.1;
T = 0.5;

%% Specify inputs to ODE solver

% this defines for Matlab the law of motion ydot given above, as a function of x and y
% sometimes the law of motion doesn't depend on x
% but you still need to define the function taking x as an input so Matlab will understand
ydot = @(x,y) [alpha*y(1)*y(2) + beta*x; y(1)^2 + y(2)^2 - x];

% Specify the values of x for which you want it to tell you the value of y
% We want to integrate from x=0 to x=T, and suppose we want the value of y at 100 equispaced points between them
X = linspace(0,T,100);
%% To shoot for the terminal condition you just switch 0 and T
%X = linspace(T,0,100);


% Specify initial condition vector
y0 = [1;1];

% Now feed all these into the ODE solver. It will return Y and Xact, where each element
% of Y is the value of y(x) at the corresponding element of Xact. Xact should be the X
% you gave Matlab earlier, unless it ran into trouble along the way and didn't manage
% to solve the ODE over the entire interval [0,T]
% (for instance, the system I wrote actually explodes in finite time, so if you
% set T too high, it won't be able to integrate the whole way)
[Xact,Y] = ode45(ydot,X,y0);
% Matlab has two functions, ode23 and ode45, which are capable of numerically solving differential equations. Both of them use a similar numerical formula, Runge-Kutta, but to a different order of approximation.
% Inputs: i) ydot is the name of the function describing our system of
% differential equations
% ii) X is the vector of values of X for which we want to tell the value of y
% iii) y_0 is the vector of the intial values of the variables in our
% system of equations



% check to see that it solved the ODE for all points we want
if length(Xact) == length(X)
    disp('Life is good!')
else
    disp('Something went wrong!')
end

% let's plot both coordinates of the path of y(x) we found!
plot(Xact,Y(:,1),Xact,Y(:,2))
legend('y1','y2')




%% A useful variation

% Sometimes we want to tell Matlab to make a special note of something happening
% along the trajectory of our ODE system, and possibly stop solving the ODE at that point

% For instance, maybe we want to know when one of the coordinates passes 4.
% We define the function "simple_event" (in simple_event.m) 
% to tell Matlab that this is the "event" we're interested in

% Set one of our options for ODE evaluation to be this event
%options = odeset('Events',@simple_event);

% Then evaluate the ODE with this options variable as input
%[Xact,Y,XE,YE,IE] = ode45(ydot,X,y0,options);

% The extra outputs are:
% XE: the value of X at the time of the event.
% YE: the value of Y at the time of the event. Assuming the event occurs (i.e. assuming the ODE system hits 4 in the interval we're considering), at least one entry of YE will be (almost) exactly 4; this implicitly tells us which coordinate hits 4 first
% IE: the index of the event function that occurred first. We only defined one event function, so this doesn't matter.

% if we plot now, the graph will be cut off when a function first hits 4
%plot(Xact,Y(:,1),Xact,Y(:,2),Xact,4*ones(length(Xact)))
%legend('y1','y2','4')