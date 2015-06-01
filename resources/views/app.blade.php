<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>SurgimapAccess - @yield('title')</title>
	<!-- title icon -->
	<link href="{{ asset('/images/logo/favicon.png') }}" type="image/png" rel="icon">
	<!-- Bootstrape CSS -->
	<link href="{{ asset('/css/app.css') }}" rel="stylesheet">
	<!-- Jquery UI CSS -->
	<link href="{{ asset('/jquery/jquery-ui.min.css') }}" rel="stylesheet">
	<!-- Fonts -->
	<link href='//fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'>
	<!-- Custom CSS/less -->
	<link href="{{ asset('/custom/css/layout.less')}}" rel="stylesheet">
	<!-- Run time CSS/less -->
	@yield('css-content')
</head>
<body>
	<nav class="navbar navbar-default">
		<div class="container-fluid col-md-offset-1">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle Navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a id="logo-link" class="navbar-brand" href="#">
					<img src="{{ asset('/images/logo/logo.png') }}">
				</a>
			</div>
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav navbar-left">
					@if (Auth::guest())
						<li><a href="{{ url('/auth/login') }}">Login</a></li>
						<li><a href="{{ url('/auth/register') }}">Register</a></li>
					@else
						<li>
							<a href="{{ url('#') }}">
							  	<i class="glyphicon glyphicon-calendar"></i> <span class="top-header"> Calendar</span>
							</a>
						</li>
						<li>
							<a href="{{ url('#') }}">
							  	<i class="glyphicon glyphicon-folder-open"></i> <span class="top-header"> Cases</span>
							</a>
						</li>
						<li>
							<a href="{{ url('#') }}">
							  	<i class="glyphicon glyphicon-user"></i> <span class="top-header"> Patients</span>
							</a>
						</li>
						<li>
							<a href="{{ url('#') }}">
							  	<i class="glyphicon glyphicon-th-list"></i> <span class="top-header"> Contacts</span>
							</a>
						</li>
						<li>
							<a href="{{ url('#') }}">
							  	<i class="glyphicon glyphicon-cog"></i> <span class="top-header"> Settings</span>
							</a>
						</li>
						<li>
							<a href="{{ url('#') }}">
							  	<i class="glyphicon glyphicon-question-sign"></i> <span class="top-header"> Helps</span>
							</a>
						</li>
						<li>
							<a href="{{ url('#') }}">
							  	<i class="glyphicon glyphicon-print"></i> <span class="top-header"> Print</span>
							</a>
						</li>
					@endif
				</ul>
				<ul class="nav navbar-nav navbar-right">
					@if (!Auth::guest())
						<li>
							<a href="#"> {{ Auth::user()->name }} </a>
						</li>
						<li>
							<a href="{{ url('/auth/logout') }}">
								<i class= "glyphicon glyphicon-off"></i> <span class="top-header"> Logout</span>
							</a>
						</li>
					@endif
				</ul>
			</div>
		</div>
		<div class="separator"></div>
	</nav>

	@yield('content')

	<footer class="footer-margin">
		<div class="col-sm-12">
			<div class="row">
				<p class="no-margin text-center">
					Copyright Nemaris Inc., 2015, All rights reserved.
				</p>
			</div>
		</div>
	</footer>

	<!-- Jquery Scripts -->
	<script src="{{ asset('/jquery/jquery-2.1.3.min.js') }}"></script>
	<script src="{{ asset('/jquery/jquery-ui.min.js') }}"></script>
	<!-- Bootstrap Scripts -->
	<script src="{{ asset('/bootstrap/bootstrap-3.3.1.min.js') }}"></script>
	<script src="{{ asset('/bootstrap/jquery-bootstrap-modal-steps.min.js')}}"></script>
	<!-- New-Custom Scripts -->

	<!-- Old-Custom Scripts -->
	<script src="{{ asset('/custom/js/browser_detect.js')}}"></script>
	<script src="{{ asset('/custom/js/constant.js')}}"></script>
	<script src="{{ asset('/custom/js/main.js')}}"></script>
	<!-- Run-time JS-->
	@yield('js-content')

</body>
</html>
